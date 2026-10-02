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