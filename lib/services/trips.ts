import 'server-only';
import { prisma } from '@/lib/db/client';

export type TripSummary = {
  id: string;
  title: string;
  status: 'DRAFT' | 'PLANNING' | 'READY' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';
  destinationName: string | null;
  destinationSlug: string | null;
  startDate: Date | null;
  endDate: Date | null;
  budgetMinor: number | null;
  currency: string;
  dayCount: number;
  createdAt: Date;
};

export type TripDetail = {
  id: string;
  title: string;
  status: 'DRAFT' | 'PLANNING' | 'READY' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';
  destination: { id: string; name: string; slug: string } | null;
  startDate: Date | null;
  endDate: Date | null;
  budgetMinor: number | null;
  currency: string;
  createdAt: Date;
  days: {
    id: string;
    dayIndex: number;
    title: string | null;
    notes: string | null;
    items: {
      id: string;
      type: string;
      title: string;
      notes: string | null;
      costMinor: number | null;
      currency: string;
      order: number;
      metadata: unknown;
    }[];
  }[];
};

export async function listUserTrips(userId: string): Promise<TripSummary[]> {
  const rows = await prisma.trip.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      startDate: true,
      endDate: true,
      budgetMinor: true,
      currency: true,
      createdAt: true,
      destination: { select: { name: true, slug: true } },
      _count: { select: { days: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    destinationName: r.destination?.name ?? null,
    destinationSlug: r.destination?.slug ?? null,
    startDate: r.startDate,
    endDate: r.endDate,
    budgetMinor: r.budgetMinor,
    currency: r.currency,
    dayCount: r._count.days,
    createdAt: r.createdAt,
  }));
}

export async function getTripForUser(
  tripId: string,
  userId: string,
): Promise<TripDetail | null> {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId },
    select: {
      id: true,
      title: true,
      status: true,
      startDate: true,
      endDate: true,
      budgetMinor: true,
      currency: true,
      createdAt: true,
      destination: { select: { id: true, name: true, slug: true } },
      days: {
        orderBy: { dayIndex: 'asc' },
        select: {
          id: true,
          dayIndex: true,
          title: true,
          notes: true,
          items: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              type: true,
              title: true,
              notes: true,
              costMinor: true,
              currency: true,
              order: true,
              metadata: true,
            },
          },
        },
      },
    },
  });

  if (!trip) return null;

  return {
    id: trip.id,
    title: trip.title,
    status: trip.status,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    budgetMinor: trip.budgetMinor,
    currency: trip.currency,
    createdAt: trip.createdAt,
    days: trip.days,
  };
}

export async function deleteTripForUser(
  tripId: string,
  userId: string,
): Promise<boolean> {
  const found = await prisma.trip.findFirst({
    where: { id: tripId, userId },
    select: { id: true },
  });
  if (!found) return false;

  await prisma.trip.delete({ where: { id: tripId } });
  return true;
}

export async function updateTripTitle(
  tripId: string,
  userId: string,
  title: string,
): Promise<boolean> {
  const found = await prisma.trip.findFirst({
    where: { id: tripId, userId },
    select: { id: true },
  });
  if (!found) return false;

  await prisma.trip.update({
    where: { id: tripId },
    data: { title },
  });
  return true;
}