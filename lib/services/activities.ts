import 'server-only';
import { prisma } from '@/lib/db/client';

export type ActivityRow = {
  id: string;
  slug: string;
  name: string;
  destinationName: string;
  durationMin: number | null;
  priceMinor: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  updatedAt: Date;
};

export async function listActivities(filters?: {
  search?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'ALL';
}): Promise<ActivityRow[]> {
  const search = filters?.search?.trim() ?? '';
  const status = filters?.status ?? 'ALL';

  const rows = await prisma.activity.findMany({
    where: {
      ...(status !== 'ALL' ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      slug: true,
      name: true,
      durationMin: true,
      priceMinor: true,
      status: true,
      updatedAt: true,
      destination: { select: { name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    destinationName: r.destination.name,
    durationMin: r.durationMin,
    priceMinor: r.priceMinor,
    status: r.status,
    updatedAt: r.updatedAt,
  }));
}

export type ActivityInput = {
  destinationId: string;
  name: string;
  slug: string;
  description?: string;
  durationMin?: number;
  priceMinor: number;
  minAge?: number;
  tags?: string[];
  imageId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

export async function createActivity(input: ActivityInput) {
  return prisma.activity.create({
    data: {
      destinationId: input.destinationId,
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      durationMin: input.durationMin ?? null,
      priceMinor: input.priceMinor,
      minAge: input.minAge ?? null,
      tags: input.tags ?? [],
      imageId: input.imageId ?? null,
      status: input.status ?? 'DRAFT',
    },
  });
}

export async function getActivityById(id: string) {
  return prisma.activity.findUnique({ where: { id } });
}

export async function updateActivity(id: string, input: ActivityInput) {
  return prisma.activity.update({
    where: { id },
    data: {
      destinationId: input.destinationId,
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      durationMin: input.durationMin ?? null,
      priceMinor: input.priceMinor,
      minAge: input.minAge ?? null,
      tags: input.tags ?? [],
      imageId: input.imageId ?? null,
      status: input.status ?? 'DRAFT',
    },
  });
}

export async function toggleActivityPublish(id: string) {
  const current = await prisma.activity.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!current) throw new Error('NOT_FOUND');
  const nextStatus = current.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  return prisma.activity.update({ where: { id }, data: { status: nextStatus } });
}

export async function deleteActivity(id: string) {
  return prisma.activity.delete({ where: { id } });
}

export async function activitySlugExists(slug: string, excludeId?: string) {
  const found = await prisma.activity.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!found) return false;
  return excludeId ? found.id !== excludeId : true;
}

export async function listDestinationsForSelect() {
  return prisma.destination.findMany({
    select: { id: true, name: true, status: true },
    orderBy: { name: 'asc' },
  });
}