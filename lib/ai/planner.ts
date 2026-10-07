import 'server-only';
import { groq, MODEL_MAIN } from './groq';
import { tripPlanSchema, type TripPlan } from './schemas/trip-plan';
import { PLANNER_SYSTEM_PROMPT, buildUserMessage } from './prompts/system';
import { buildContext } from './context-builder';
import { TOOL_DEFINITIONS } from './tools/registry';
import { executeTool } from './tools/execute';
import type { ToolName } from './tools/types';

export type GenerateTripPlanInput = {
  userPrompt: string;
  destinationId?: string;
  travelers?: string;
  budget?: string;
  dates?: string;
};

export type GenerateTripPlanResult =
  | { ok: true; plan: TripPlan; contextUsed: number; toolsUsed: string[] }
  | { ok: false; error: string; raw?: string };

const MAX_TOOL_ROUNDS = 5;

export async function generateTripPlan(
  input: GenerateTripPlanInput,
): Promise<GenerateTripPlanResult> {
  // 1. RAG context
  const context = await buildContext({
    query: input.userPrompt,
    destinationId: input.destinationId,
    topK: 8,
  });

  // 2. Build user message
  const userMessage = buildUserMessage({
    userPrompt: input.userPrompt,
    travelers: input.travelers,
    budget: input.budget,
    dates: input.dates,
    context: context.asText,
  });

  // 3. PHASE 1 — tool-calling conversation (no response_format)
  type Message =
    | { role: 'system'; content: string }
    | { role: 'user'; content: string }
    | { role: 'assistant'; content: string | null; tool_calls?: any[] }
    | { role: 'tool'; content: string; tool_call_id: string };

  const messages: Message[] = [
    { role: 'system', content: PLANNER_SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ];

  const toolsUsed = new Set<string>();
  let draft = '';

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    let completion: any;
    try {
      completion = await groq.chat.completions.create({
        model: MODEL_MAIN,
        temperature: 0.4,
        max_tokens: 4000,
        // NO response_format here — tools require plain text mode
        reasoning_effort: 'low',
        reasoning_format: 'hidden',
        tools: TOOL_DEFINITIONS,
        tool_choice: 'auto',
        messages,
      } as any);
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Groq call failed',
      };
    }

    const choice = completion.choices?.[0];
    const msg = choice?.message;
    if (!msg) return { ok: false, error: 'Empty response from Groq' };

    // Model asked for tools → run them, loop
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      messages.push({
        role: 'assistant',
        content: msg.content ?? null,
        tool_calls: msg.tool_calls,
      });

      for (const call of msg.tool_calls) {
        const name = call.function?.name as ToolName;
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(call.function?.arguments ?? '{}');
        } catch {
          args = {};
        }
        toolsUsed.add(name);
        console.log(`[planner] tool call: ${name}`, args);

        let result: unknown;
        try {
          result = await executeTool(name, args);
        } catch (err) {
          result = {
            error: err instanceof Error ? err.message : 'Tool failed',
          };
        }
        console.log(
          `[planner] tool result: ${name} →`,
          Array.isArray(result) ? `${result.length} results` : 'non-array',
        );

        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
      continue;
    }

    // No tool calls → this is the model's draft answer
    draft = msg.content ?? '';
    break;
  }

  if (!draft) {
    return { ok: false, error: 'Model did not produce a response' };
  }

  // 4. Try to parse the draft as-is
  let parsed = tryParsePlan(draft);
  let raw = draft;

  // 5. PHASE 2 — if the draft wasn't valid JSON, reformat with JSON mode
  if (!parsed) {
    console.log('[planner] phase 1 draft was not valid JSON — running JSON reformat');

    try {
      const reformat = await groq.chat.completions.create({
        model: MODEL_MAIN,
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
        reasoning_effort: 'low',
        reasoning_format: 'hidden',
        messages: [
          {
            role: 'system',
            content:
              'You are a JSON reformatter. Convert the assistant draft into a strict JSON object matching the requested schema. Output ONLY the JSON object, no prose, no markdown fences.',
          },
          {
            role: 'user',
            content: `DRAFT TO REFORMAT:\n\n${draft}\n\nProduce the TripPlan JSON now.`,
          },
        ],
      } as any);

      raw = reformat.choices?.[0]?.message?.content ?? '';
      parsed = tryParsePlan(raw);
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Reformat call failed',
        raw: draft,
      };
    }
  }

  if (!parsed) {
    return {
      ok: false,
      error: 'Model output did not produce a valid TripPlan JSON',
      raw,
    };
  }

  // 6. Validate against Zod schema
  const validated = tripPlanSchema.safeParse(parsed);
  if (!validated.success) {
    console.log('[planner] validation failed. Raw output (first 2000 chars):');
    console.log(raw.slice(0, 2000));
    return {
      ok: false,
      error:
        'Model output did not match schema: ' +
        JSON.stringify(validated.error.flatten().fieldErrors),
      raw,
    };
  }

  return {
    ok: true,
    plan: validated.data,
    contextUsed: context.chunks.length,
    toolsUsed: Array.from(toolsUsed),
  };
}

/* ---------------- helpers ---------------- */

function tryParsePlan(text: string): unknown | null {
  if (!text) return null;

  // Strip markdown fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  }

  // If there's prose before the JSON, try to find the first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) return null;
  const jsonSlice = cleaned.slice(firstBrace, lastBrace + 1);

  try {
    const json = JSON.parse(jsonSlice);
    if (
      json &&
      typeof json === 'object' &&
      !Array.isArray(json) &&
      !('title' in json) &&
      ('plan' in json || 'trip' in json)
    ) {
      const wrapper = json as Record<string, unknown>;
      return wrapper.plan ?? wrapper.trip;
    }
    return json;
  } catch {
    return null;
  }
}