import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateTripPlan } from '@/lib/ai/planner';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Auth: allow logged-out for now so we can test easily.
  // In production, gate this to logged-in users.
  const user = await getCurrentUser();

  const body = await req.json().catch(() => null);
  const userPrompt = typeof body?.userPrompt === 'string' ? body.userPrompt.trim() : '';

  if (!userPrompt || userPrompt.length < 5) {
    return Response.json(
      { ok: false, error: 'PROMPT_TOO_SHORT' },
      { status: 400 },
    );
  }

  const start = Date.now();
  const result = await generateTripPlan({
    userPrompt,
    destinationId:
      typeof body?.destinationId === 'string' ? body.destinationId : undefined,
    travelers: typeof body?.travelers === 'string' ? body.travelers : undefined,
    budget: typeof body?.budget === 'string' ? body.budget : undefined,
    dates: typeof body?.dates === 'string' ? body.dates : undefined,
  });
  const elapsedMs = Date.now() - start;

  if (!result.ok) {
    console.error('[planner]', result.error, result.raw?.slice(0, 500));
    return Response.json(
      { ok: false, error: result.error },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    elapsedMs,
    contextUsed: result.contextUsed,
    userId: user?.id ?? null,
    plan: result.plan,
  });
}