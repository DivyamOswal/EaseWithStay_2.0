import 'server-only';
import { prisma } from '@/lib/db/client';

export type HotelRow = {
  id: string;
  slug: string;
  name: string;
  destinationName: string;
  starRating: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  updatedAt: Date;
};

export async function listHotels(filters?: {
  search?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'ALL';
  destinationId?: string;
}): Promise<HotelRow[]> {
  const search = filters?.search?.trim() ?? '';
  const status = filters?.status ?? 'ALL';

  const rows = await prisma.hotel.findMany({
    where: {
      ...(status !== 'ALL' ? { status } : {}),
      ...(filters?.destinationId ? { destinationId: filters.destinationId } : {}),
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
      starRating: true,
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
    starRating: r.starRating,
    status: r.status,
    updatedAt: r.updatedAt,
  }));
}

export type HotelInput = {
  destinationId: string;
  name: string;
  slug: string;
  starRating?: number;
  address?: string;
  description?: string;
  imageId?: string;
  amenities?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

export async function createHotel(input: HotelInput) {
  return prisma.hotel.create({
    data: {
      destinationId: input.destinationId,
      name: input.name,
      slug: input.slug,
      starRating: input.starRating ?? null,
      address: input.address ?? null,
      description: input.description ?? null,
      imageId: input.imageId ?? null,
      amenities: input.amenities ?? [],
      status: input.status ?? 'DRAFT',
    },
  });
}

export async function getHotelById(id: string) {
  return prisma.hotel.findUnique({ where: { id } });
}

export async function updateHotel(id: string, input: HotelInput) {
  return prisma.hotel.update({
    where: { id },
    data: {
      destinationId: input.destinationId,
      name: input.name,
      slug: input.slug,
      starRating: input.starRating ?? null,
      address: input.address ?? null,
      description: input.description ?? null,
      imageId: input.imageId ?? null,
      amenities: input.amenities ?? [],
      status: input.status ?? 'DRAFT',
    },
  });
}

export async function toggleHotelPublish(id: string) {
  const current = await prisma.hotel.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!current) throw new Error('NOT_FOUND');
  const nextStatus = current.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  return prisma.hotel.update({
    where: { id },
    data: { status: nextStatus },
  });
}

export async function deleteHotel(id: string) {
  return prisma.hotel.delete({ where: { id } });
}

export async function hotelSlugExists(slug: string, excludeId?: string) {
  const found = await prisma.hotel.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!found) return false;
  return excludeId ? found.id !== excludeId : true;
}

// Light list for the destination dropdown
export async function listDestinationsForSelect() {
  return prisma.destination.findMany({
    select: { id: true, name: true, status: true },
    orderBy: { name: 'asc' },
  });
}