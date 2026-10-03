import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateTripPlan } from '@/lib/ai/planner';
import { createTripFromPlan } from '@/lib/services/trip-converter';
import { prisma } from '@/lib/db/client';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // 1. Auth gate — required. The old version allowed anonymous
  //    requests for curl testing; the frontend will pass the session
  //    cookie automatically.
  const user = await getCurrentUser();
  if (!user) {
    return Response.json(
      { ok: false, error: 'UNAUTHENTICATED' },
      { status: 401 },
    );
  }

  // 2. Parse body
  const body = await req.json().catch(() => null);
  const userPrompt =
    typeof body?.userPrompt === 'string' ? body.userPrompt.trim() : '';

  if (!userPrompt || userPrompt.length < 5) {
    return Response.json(
      { ok: false, error: 'PROMPT_TOO_SHORT' },
      { status: 400 },
    );
  }

  const destinationId =
    typeof body?.destinationId === 'string' ? body.destinationId : undefined;
  const saveAsTrip = body?.saveAsTrip === true;

  // 3. If a destinationId was supplied, confirm it exists before
  //    wasting a Groq call.
  if (destinationId) {
    const dest = await prisma.destination.findUnique({
      where: { id: destinationId },
      select: { id: true },
    });
    if (!dest) {
      return Response.json(
        { ok: false, error: 'DESTINATION_NOT_FOUND' },
        { status: 400 },
      );
    }
  }

  // 4. Generate the plan
  const start = Date.now();
  const result = await generateTripPlan({
    userPrompt,
    destinationId,
    travelers:
      typeof body?.travelers === 'string' ? body.travelers : undefined,
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

  // 5. Optionally persist as a Trip
  let tripId: string | null = null;
  if (saveAsTrip) {
    try {
      const trip = await createTripFromPlan({
        plan: result.plan,
        userId: user.id,
        destinationId: destinationId ?? null,
      });
      tripId = trip.id;
    } catch (err) {
      // Persistence failure shouldn't erase a good plan.
      // Log it, return the plan, and let the UI show a warning.
      console.error('[planner] trip persistence failed:', err);
    }
  }

  return Response.json({
    ok: true,
    elapsedMs,
    contextUsed: result.contextUsed,
    plan: result.plan,
    tripId,
  });
}