import 'server-only';
import { prisma } from '@/lib/db/client';
import type {
  HotelResult,
  ActivityResult,
  RestaurantResult,
} from './types';

async function findDestinationIdByName(name: string): Promise<string | null> {
  const cleaned = name.trim().toLowerCase();
  // Try exact match first, then a loose contains match
  const exact = await prisma.destination.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
    select: { id: true },
  });
  if (exact) return exact.id;

  const loose = await prisma.destination.findFirst({
    where: { name: { contains: cleaned, mode: 'insensitive' } },
    select: { id: true },
  });
  return loose?.id ?? null;
}

export async function handleSearchHotels(args: {
  destinationName: string;
  maxPriceMinor?: number;
}): Promise<HotelResult[]> {
  const destinationId = await findDestinationIdByName(args.destinationName);
  if (!destinationId) return [];

  const rows = await prisma.hotel.findMany({
    where: { destinationId, status: 'PUBLISHED' },
    select: {
      id: true,
      name: true,
      starRating: true,
      amenities: true,
      address: true,
      description: true,
    },
    orderBy: [{ starRating: 'desc' }, { name: 'asc' }],
    take: 8,
  });
  return rows;
}

export async function handleSearchActivities(args: {
  destinationName: string;
  minAge?: number;
  maxPriceMinor?: number;
}): Promise<ActivityResult[]> {
  const destinationId = await findDestinationIdByName(args.destinationName);
  if (!destinationId) return [];

  const rows = await prisma.activity.findMany({
    where: {
      destinationId,
      status: 'PUBLISHED',
      ...(args.maxPriceMinor != null
        ? { priceMinor: { lte: args.maxPriceMinor } }
        : {}),
      ...(args.minAge != null
        ? { OR: [{ minAge: null }, { minAge: { lte: args.minAge } }] }
        : {}),
    },
    select: {
      id: true,
      name: true,
      durationMin: true,
      priceMinor: true,
      minAge: true,
      tags: true,
      description: true,
    },
    orderBy: [{ priceMinor: 'asc' }],
    take: 10,
  });
  return rows;
}

export async function handleSearchRestaurants(args: {
  destinationName: string;
  dietary?: string;
}): Promise<RestaurantResult[]> {
  const destinationId = await findDestinationIdByName(args.destinationName);
  if (!destinationId) return [];

  const rows = await prisma.restaurant.findMany({
    where: {
      destinationId,
      status: 'PUBLISHED',
      ...(args.dietary
        ? { dietary: { has: args.dietary } }
        : {}),
    },
    select: {
      id: true,
      name: true,
      cuisine: true,
      dietary: true,
      rating: true,
      priceLevel: true,
    },
    orderBy: [{ rating: 'desc' }],
    take: 8,
  });
  return rows;
}