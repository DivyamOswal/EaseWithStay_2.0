import 'server-only';
import { prisma } from '@/lib/db/client';

export type RestaurantRow = {
  id: string;
  slug: string;
  name: string;
  destinationName: string;
  cuisine: string[];
  rating: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  updatedAt: Date;
};

export async function listRestaurants(filters?: {
  search?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'ALL';
}): Promise<RestaurantRow[]> {
  const search = filters?.search?.trim() ?? '';
  const status = filters?.status ?? 'ALL';

  const rows = await prisma.restaurant.findMany({
    where: {
      ...(status !== 'ALL' ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      cuisine: true,
      rating: true,
      status: true,
      updatedAt: true,
      destination: { select: { name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return rows.map((r) => ({
    id: r.id,
    slug: r.name.toLowerCase().replace(/\s+/g, '-'),
    name: r.name,
    destinationName: r.destination.name,
    cuisine: r.cuisine,
    rating: r.rating,
    status: r.status,
    updatedAt: r.updatedAt,
  }));
}

export type RestaurantInput = {
  destinationId: string;
  name: string;
  cuisine: string[];
  dietary: string[];
  lat?: number;
  lng?: number;
  priceLevel?: number;
  rating?: number;
  imageId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

export async function createRestaurant(input: RestaurantInput) {
  return prisma.restaurant.create({
    data: {
      destinationId: input.destinationId,
      name: input.name,
      cuisine: input.cuisine,
      dietary: input.dietary,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      priceLevel: input.priceLevel ?? null,
      rating: input.rating ?? null,
      imageId: input.imageId ?? null,
      status: input.status ?? 'DRAFT',
    },
  });
}

export async function getRestaurantById(id: string) {
  return prisma.restaurant.findUnique({ where: { id } });
}

export async function updateRestaurant(id: string, input: RestaurantInput) {
  return prisma.restaurant.update({
    where: { id },
    data: {
      destinationId: input.destinationId,
      name: input.name,
      cuisine: input.cuisine,
      dietary: input.dietary,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      priceLevel: input.priceLevel ?? null,
      rating: input.rating ?? null,
      imageId: input.imageId ?? null,
      status: input.status ?? 'DRAFT',
    },
  });
}

export async function toggleRestaurantPublish(id: string) {
  const current = await prisma.restaurant.findUnique({ where: { id }, select: { status: true } });
  if (!current) throw new Error('NOT_FOUND');
  const nextStatus = current.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  return prisma.restaurant.update({ where: { id }, data: { status: nextStatus } });
}

export async function deleteRestaurant(id: string) {
  return prisma.restaurant.delete({ where: { id } });
}

export async function listDestinationsForSelect() {
  return prisma.destination.findMany({
    select: { id: true, name: true, status: true },
    orderBy: { name: 'asc' },
  });
}