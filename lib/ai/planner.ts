import 'server-only';
import { groq, MODEL_MAIN } from './groq';
import { tripPlanSchema, type TripPlan } from './schemas/trip-plan';
import { PLANNER_SYSTEM_PROMPT, buildUserMessage } from './prompts/system';
import { buildContext } from './context-builder';

export type GenerateTripPlanInput = {
  userPrompt: string;
  destinationId?: string;
  travelers?: string;
  budget?: string;
  dates?: string;
};

export type GenerateTripPlanResult =
  | { ok: true; plan: TripPlan; contextUsed: number }
  | { ok: false; error: string; raw?: string };

export async function generateTripPlan(
  input: GenerateTripPlanInput,
): Promise<GenerateTripPlanResult> {
  // 1. Retrieve RAG context
  const context = await buildContext({
    query: input.userPrompt,
    destinationId: input.destinationId,
    topK: 8,
  });

  // 2. Build the user message
  const userMessage = buildUserMessage({
    userPrompt: input.userPrompt,
    travelers: input.travelers,
    budget: input.budget,
    dates: input.dates,
    context: context.asText,
  });

  // 3. Call Groq with JSON mode
  let raw: string;
  try {
    const completion = await groq.chat.completions.create({
  model: MODEL_MAIN,
  temperature: 0.4,
  max_tokens: 4000,
  response_format: { type: 'json_object' },
  // GPT-OSS models are reasoning models — keep reasoning low so it
  // doesn't crowd out the JSON output, and hide it from the response.
  reasoning_effort: 'low',
  reasoning_format: 'hidden',
  messages: [
    { role: 'system', content: PLANNER_SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ],
} as any);
    raw = completion.choices[0]?.message?.content ?? '';
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Groq call failed',
    };
  }

  // 4. Parse and validate
  let parsed: unknown;
try {
  const json = JSON.parse(raw);
  // Defensive: if the model wrapped the plan in a key like "plan" or "trip",
  // unwrap it before validation.
  if (
    json &&
    typeof json === 'object' &&
    !Array.isArray(json) &&
    !('title' in json) &&
    ('plan' in json || 'trip' in json)
  ) {
    const wrapper = json as Record<string, unknown>;
    parsed = wrapper.plan ?? wrapper.trip;
  } else {
    parsed = json;
  }
} catch {
  return { ok: false, error: 'Model returned invalid JSON', raw };
}

  const validated = tripPlanSchema.safeParse(parsed);
  if (!validated.success) {
    console.log('[planner] raw model output (first 2000 chars):');
console.log(raw.slice(0, 2000));
    return {
      ok: false,
      error:
        'Model output did not match schema: ' +
        JSON.stringify(validated.error.flatten().fieldErrors),
      raw,
    };
  }

  return { ok: true, plan: validated.data, contextUsed: context.chunks.length };
}