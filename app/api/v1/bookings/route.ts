import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import {
  createBookingFromTrip,
  confirmBooking,
  listUserBookings,
} from '@/lib/services/bookings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 });
  }
  const bookings = await listUserBookings(user.id);
  return Response.json({ ok: true, count: bookings.length, bookings });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const tripId = typeof body?.tripId === 'string' ? body.tripId : '';
  const idempotencyKey =
    typeof body?.idempotencyKey === 'string' ? body.idempotencyKey : '';

  if (!tripId) {
    return Response.json({ ok: false, error: 'NO_TRIP_ID' }, { status: 400 });
  }
  if (!idempotencyKey || idempotencyKey.length < 8) {
    return Response.json(
      { ok: false, error: 'NO_IDEMPOTENCY_KEY' },
      { status: 400 },
    );
  }

  try {
    const booking = await createBookingFromTrip({
      tripId,
      userId: user.id,
      idempotencyKey,
    });

    // Phase 16 will move this to a webhook handler.
    // For now, immediately confirm.
    await confirmBooking(booking.id);

    return Response.json({
      ok: true,
      bookingId: booking.id,
      reference: booking.reference,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'UNKNOWN';
    console.error('[booking-create]', message);

    const clientMessage = (() => {
      switch (message) {
        case 'TRIP_NOT_FOUND':
          return 'Trip not found.';
        case 'EMPTY_TRIP':
          return 'This trip has no itinerary to book.';
        case 'NO_BOOKABLE_ITEMS':
          return 'This trip has no priced items to book.';
        default:
          return 'Could not create the booking. Please try again.';
      }
    })();

    return Response.json(
      { ok: false, error: message, message: clientMessage },
      { status: 400 },
    );
  }
}