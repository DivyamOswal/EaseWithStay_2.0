import 'server-only';
import { prisma } from '@/lib/db/client';
import type { BookingStatus } from '@/lib/generated/prisma/enums';

export type BookingRow = {
  id: string;
  reference: string;
  userName: string;
  userEmail: string;
  tripTitle: string | null;
  status: BookingStatus;
  totalMinor: number;
  currency: string;
  createdAt: Date;
};

export async function listBookings(filters?: {
  search?: string;
  status?: BookingStatus | 'ALL';
}): Promise<BookingRow[]> {
  const search = filters?.search?.trim() ?? '';
  const status = filters?.status ?? 'ALL';

  const rows = await prisma.booking.findMany({
    where: {
      ...(status !== 'ALL' ? { status } : {}),
      ...(search
        ? {
            OR: [
              { reference: { contains: search, mode: 'insensitive' } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      reference: true,
      status: true,
      totalMinor: true,
      currency: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
      trip: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return rows.map((r) => ({
    id: r.id,
    reference: r.reference,
    userName: r.user.name ?? r.user.email,
    userEmail: r.user.email,
    tripTitle: r.trip?.title ?? null,
    status: r.status,
    totalMinor: r.totalMinor,
    currency: r.currency,
    createdAt: r.createdAt,
  }));
}

// ============================================================
// USER-FACING BOOKING OPERATIONS
// ============================================================

export type BookingDetail = {
  id: string;
  reference: string;
  status: BookingStatus;
  totalMinor: number;
  currency: string;
  notes: string | null;
  confirmedAt: Date | null;
  createdAt: Date;
  trip: { id: string; title: string } | null;
  items: {
    id: string;
    type: string;
    title: string;
    priceMinor: number;
    snapshot: unknown;
  }[];
};

/**
 * Generate a human-readable booking reference.
 * Format: EWS-GOA-88421
 */
function generateReference(destinationSlug: string | null): string {
  const code = (destinationSlug ?? 'TRP')
    .replace(/[^a-z]/gi, '')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X');
  const num = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `EWS-${code}-${num}`;
}

/**
 * Create a booking from a saved Trip.
 * Snapshots all itinerary items as BookingItems.
 * Idempotent: if `idempotencyKey` matches an existing booking,
 * returns that one instead of creating a duplicate.
 */
export async function createBookingFromTrip(input: {
  tripId: string;
  userId: string;
  idempotencyKey: string;
}) {
  // 1. Idempotency check
  const existing = await prisma.booking.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
    include: { items: true },
  });
  if (existing) return existing;

  // 2. Load the trip with all its content
  const trip = await prisma.trip.findFirst({
    where: { id: input.tripId, userId: input.userId },
    include: {
      destination: { select: { slug: true, name: true } },
      days: { include: { items: true } },
    },
  });

  if (!trip) throw new Error('TRIP_NOT_FOUND');
  if (trip.days.length === 0) throw new Error('EMPTY_TRIP');

  // 3. Compute total from itinerary items
  const allItems = trip.days.flatMap((day) => day.items);
  const totalMinor = allItems.reduce(
    (sum, item) => sum + (item.costMinor ?? 0),
    0,
  );

  if (totalMinor <= 0) throw new Error('NO_BOOKABLE_ITEMS');

  // 4. Create the booking with snapshot items
  // We do the reference-collision retry loop here.
  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = generateReference(trip.destination?.slug ?? null);

    try {
      const booking = await prisma.booking.create({
        data: {
          userId: input.userId,
          tripId: trip.id,
          reference,
          status: 'PENDING',
          totalMinor,
          currency: trip.currency,
          idempotencyKey: input.idempotencyKey,
          items: {
            create: allItems.map((item) => ({
              type: mapItemType(item.type),
              refId: item.id,
              title: item.title,
              snapshotJson: {
                type: item.type,
                title: item.title,
                notes: item.notes,
                startTime: (item.metadata as { startTime?: string } | null)?.startTime ?? null,
                endTime: (item.metadata as { endTime?: string } | null)?.endTime ?? null,
                dayIndex: trip.days.find((d) => d.id === item.tripDayId)?.dayIndex ?? null,
              },
              priceMinor: item.costMinor ?? 0,
              currency: trip.currency,
            })),
          },
        },
        include: { items: true },
      });

      return booking;
    } catch (err) {
      // P2002 = unique constraint violation (likely reference collision)
      if (
        err instanceof Error &&
        'code' in err &&
        (err as { code?: string }).code === 'P2002' &&
        attempt < 4
      ) {
        continue; // retry with a new reference
      }
      throw err;
    }
  }

  throw new Error('REFERENCE_GENERATION_FAILED');
}

function mapItemType(
  aiType: string,
):
  | 'HOTEL'
  | 'FLIGHT'
  | 'ACTIVITY'
  | 'TRANSFER'
  | 'FEE' {
  switch (aiType) {
    case 'HOTEL':
      return 'HOTEL';
    case 'FLIGHT':
      return 'FLIGHT';
    case 'ACTIVITY':
      return 'ACTIVITY';
    case 'RESTAURANT':
    case 'TRANSPORT':
      return 'TRANSFER';
    default:
      return 'FEE';
  }
}

/**
 * Transition PENDING → CONFIRMING → CONFIRMED.
 * Idempotent: calling on an already-confirmed booking is a no-op.
 */
export async function confirmBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true },
  });
  if (!booking) throw new Error('NOT_FOUND');
  if (booking.status === 'CONFIRMED') return;
  if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMING') {
    throw new Error('INVALID_STATE');
  }

  // Move to CONFIRMING, then CONFIRMED.
  // In Phase 16, this is where payment would gate the transition.
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMING' },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMED', confirmedAt: new Date() },
  });
}

export async function getBookingForUser(
  bookingId: string,
  userId: string,
): Promise<BookingDetail | null> {
  const b = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: {
      items: true,
      trip: { select: { id: true, title: true } },
    },
  });
  if (!b) return null;

  return {
    id: b.id,
    reference: b.reference,
    status: b.status,
    totalMinor: b.totalMinor,
    currency: b.currency,
    notes: b.notes,
    confirmedAt: b.confirmedAt,
    createdAt: b.createdAt,
    trip: b.trip,
    items: b.items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      priceMinor: item.priceMinor,
      snapshot: item.snapshotJson,
    })),
  };
}

export async function listUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      reference: true,
      status: true,
      totalMinor: true,
      currency: true,
      createdAt: true,
      trip: { select: { id: true, title: true } },
      _count: { select: { items: true } },
    },
  });
}