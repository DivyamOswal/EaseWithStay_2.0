import 'server-only';
import { groq, MODEL_MAIN } from '../groq';
import { tripPlanSchema, type TripPlan } from '../schemas/trip-plan';
import {
  REFINE_SYSTEM_PROMPT,
  buildRefineUserMessage,
} from '../prompts/refine-prompts';
import { buildContext } from '../context-builder';
import { TOOL_DEFINITIONS } from '../tools/registry'
import { executeTool } from '../tools/execute';
import type { ToolName } from '../tools/types';

export type RefineTripPlanInput = {
  currentPlan: TripPlan;
  userRequest: string;
  destinationId?: string;
};

export type RefineTripPlanResult =
  | { ok: true; plan: TripPlan; toolsUsed: string[] }
  | { ok: false; error: string; raw?: string };

const MAX_TOOL_ROUNDS = 4;

export async function refineTripPlan(
  input: RefineTripPlanInput,
): Promise<RefineTripPlanResult> {
  // 1. RAG context (light — the plan already carries most of the info)
  const context = await buildContext({
    query: input.userRequest,
    destinationId: input.destinationId,
    topK: 5,
  });

  // 2. Build messages
  type Message =
    | { role: 'system'; content: string }
    | { role: 'user'; content: string }
    | { role: 'assistant'; content: string | null; tool_calls?: any[] }
    | { role: 'tool'; content: string; tool_call_id: string };

  const messages: Message[] = [
    { role: 'system', content: REFINE_SYSTEM_PROMPT },
    {
      role: 'user',
      content: buildRefineUserMessage({
        currentPlan: input.currentPlan,
        userRequest: input.userRequest,
        context: context.asText,
      }),
    },
  ];

  const toolsUsed = new Set<string>();
  let draft = '';

  // 3. Tool-calling loop (no response_format here)
  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    let completion: any;
    try {
      completion = await groq.chat.completions.create({
        model: MODEL_MAIN,
        temperature: 0.3,
        max_tokens: 4000,
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

    const msg = completion.choices?.[0]?.message;
    if (!msg) return { ok: false, error: 'Empty response from Groq' };

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
        console.log(`[refine] tool call: ${name}`, args);

        let result: unknown;
        try {
          result = await executeTool(name, args);
        } catch (err) {
          result = {
            error: err instanceof Error ? err.message : 'Tool failed',
          };
        }

        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
      continue;
    }

    draft = msg.content ?? '';
    break;
  }

  if (!draft) return { ok: false, error: 'Model did not produce a response' };

  // 4. Parse
  let parsed = tryParsePlan(draft);
  let raw = draft;

  // 5. If draft was prose, reformat with JSON mode
  if (!parsed) {
    console.log('[refine] reformatting with JSON mode');
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
              'Convert the draft into a strict TripPlan JSON object. Output ONLY the JSON.',
          },
          { role: 'user', content: draft },
        ],
      } as any);
      raw = reformat.choices?.[0]?.message?.content ?? '';
      parsed = tryParsePlan(raw);
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Reformat failed',
        raw: draft,
      };
    }
  }

  if (!parsed) {
    return { ok: false, error: 'Could not parse refined plan', raw };
  }

  // 6. Validate
  const validated = tripPlanSchema.safeParse(parsed);
  if (!validated.success) {
    console.log('[refine] validation failed. Raw:', raw.slice(0, 2000));
    return {
      ok: false,
      error:
        'Refined output did not match schema: ' +
        JSON.stringify(validated.error.flatten().fieldErrors),
      raw,
    };
  }

  return {
    ok: true,
    plan: validated.data,
    toolsUsed: Array.from(toolsUsed),
  };
}

function tryParsePlan(text: string): unknown | null {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  }
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first === -1 || last === -1) return null;
  try {
    const json = JSON.parse(cleaned.slice(first, last + 1));
    if (
      json &&
      typeof json === 'object' &&
      !Array.isArray(json) &&
      !('title' in json) &&
      ('plan' in json || 'trip' in json)
    ) {
      const w = json as Record<string, unknown>;
      return w.plan ?? w.trip;
    }
    return json;
  } catch {
    return null;
  }
}