import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { refineTripPlan } from '@/lib/ai/prompts/refine';
import { tripPlanSchema } from '@/lib/ai/schemas/trip-plan';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json(
      { ok: false, error: 'UNAUTHENTICATED' },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  const userRequest =
    typeof body?.userRequest === 'string' ? body.userRequest.trim() : '';

  if (!userRequest || userRequest.length < 3) {
    return Response.json(
      { ok: false, error: 'REQUEST_TOO_SHORT' },
      { status: 400 },
    );
  }

  const planParsed = tripPlanSchema.safeParse(body?.currentPlan);
  if (!planParsed.success) {
    return Response.json(
      { ok: false, error: 'INVALID_CURRENT_PLAN' },
      { status: 400 },
    );
  }

  const start = Date.now();
  const result = await refineTripPlan({
    currentPlan: planParsed.data,
    userRequest,
    destinationId:
      typeof body?.destinationId === 'string' ? body.destinationId : undefined,
  });
  const elapsedMs = Date.now() - start;

  if (!result.ok) {
    console.error('[refine]', result.error, result.raw?.slice(0, 500));
    return Response.json(
      { ok: false, error: result.error },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    elapsedMs,
    toolsUsed: result.toolsUsed,
    plan: result.plan,
  });
}