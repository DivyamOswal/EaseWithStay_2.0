import 'server-only';
import { prisma } from '@/lib/db/client';
import type { UserRole } from '@/lib/generated/prisma/enums';

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  tripCount: number;
  bookingCount: number;
  createdAt: Date;
};

// Listing the user
export async function listUsers(filters?: {
  search?: string;
  role?: UserRole | 'ALL';
}): Promise<UserRow[]> {
  const search = filters?.search?.trim() ?? '';
  const role = filters?.role ?? 'ALL';

  const rows = await prisma.user.findMany({
    where: {
      ...(role !== 'ALL' ? { role } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { trips: true, bookings: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    role: r.role,
    tripCount: r._count.trips,
    bookingCount: r._count.bookings,
    createdAt: r.createdAt,
  }));
}

export async function updateUserRole(id: string, role: UserRole) {
  // Guard: don't allow removing the last admin
  if (role !== 'ADMIN') {
    const target = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (target?.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        throw new Error('LAST_ADMIN');
      }
    }
  }
  return prisma.user.update({ where: { id }, data: { role } });
}