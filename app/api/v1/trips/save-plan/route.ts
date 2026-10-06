import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { tripPlanSchema } from '@/lib/ai/schemas/trip-plan';
import { createTripFromPlan } from '@/lib/services/trip-converter';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = tripPlanSchema.safeParse(body?.plan);
  if (!parsed.success) {
    return Response.json({ ok: false, error: 'INVALID_PLAN' }, { status: 400 });
  }

  const destinationId =
    typeof body?.destinationId === 'string' ? body.destinationId : null;

  try {
    const trip = await createTripFromPlan({
      plan: parsed.data,
      userId: user.id,
      destinationId,
    });
    return Response.json({ ok: true, tripId: trip.id });
  } catch (err) {
    console.error('[save-plan]', err);
    return Response.json({ ok: false, error: 'SAVE_FAILED' }, { status: 500 });
  }
}