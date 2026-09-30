import 'server-only';
import { prisma } from '@/lib/db/client';

export type DestinationRow = {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: Date | null;
  updatedAt: Date;
};

export async function listDestinations(filters?: {
  search?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'ALL';
}): Promise<DestinationRow[]> {
  const search = filters?.search?.trim() ?? '';
  const status = filters?.status ?? 'ALL';

  return prisma.destination.findMany({
    where: {
      ...(status !== 'ALL' ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
              { country: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      slug: true,
      name: true,
      country: true,
      region: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function togglePublish(id: string) {
  const current = await prisma.destination.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!current) throw new Error('NOT_FOUND');

  const nextStatus = current.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  const publishedAt = nextStatus === 'PUBLISHED' ? new Date() : null;

  return prisma.destination.update({
    where: { id },
    data: { status: nextStatus, publishedAt },
  });
}

export async function deleteDestination(id: string) {
  return prisma.destination.delete({ where: { id } });
}