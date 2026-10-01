'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdminPage } from '@/lib/auth/admin-guard';
import { restaurantSchema } from '@/lib/validators/restaurant';
import {
  createRestaurant,
  updateRestaurant,
  toggleRestaurantPublish,
  deleteRestaurant,
} from '@/lib/services/restaurants';

export type RestaurantActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function splitCsv(v: string | undefined): string[] {
  if (!v) return [];
  return v.split(',').map((s) => s.trim()).filter(Boolean);
}

function parseForm(fd: FormData) {
  return {
    destinationId: String(fd.get('destinationId') ?? ''),
    name: String(fd.get('name') ?? ''),
    cuisine: String(fd.get('cuisine') ?? ''),
    dietary: String(fd.get('dietary') ?? ''),
    lat: String(fd.get('lat') ?? '') || undefined,
    lng: String(fd.get('lng') ?? '') || undefined,
    priceLevel: String(fd.get('priceLevel') ?? '') || undefined,
    rating: String(fd.get('rating') ?? '') || undefined,
    imageId: String(fd.get('imageId') ?? ''),
    status: String(fd.get('status') ?? 'DRAFT'),
  };
}

export async function createRestaurantAction(
  _prev: RestaurantActionState,
  fd: FormData,
): Promise<RestaurantActionState> {
  await requireAdminPage();
  const parsed = restaurantSchema.safeParse(parseForm(fd));
  if (!parsed.success) {
    return { ok: false, error: 'Please fix the errors below.', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  try {
    await createRestaurant({
      destinationId: parsed.data.destinationId,
      name: parsed.data.name,
      cuisine: splitCsv(parsed.data.cuisine),
      dietary: splitCsv(parsed.data.dietary),
      lat: typeof parsed.data.lat === 'number' ? parsed.data.lat : undefined,
      lng: typeof parsed.data.lng === 'number' ? parsed.data.lng : undefined,
      priceLevel: typeof parsed.data.priceLevel === 'number' ? parsed.data.priceLevel : undefined,
      rating: typeof parsed.data.rating === 'number' ? parsed.data.rating : undefined,
      imageId: parsed.data.imageId || undefined,
      status: parsed.data.status,
    });
  } catch (err) {
    console.error('[createRestaurantAction]', err);
    return { ok: false, error: 'Something went wrong. Try again.' };
  }
  revalidatePath('/admin/restaurants');
  redirect('/admin/restaurants');
}

export async function updateRestaurantAction(
  id: string,
  _prev: RestaurantActionState,
  fd: FormData,
): Promise<RestaurantActionState> {
  await requireAdminPage();
  const parsed = restaurantSchema.safeParse(parseForm(fd));
  if (!parsed.success) {
    return { ok: false, error: 'Please fix the errors below.', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateRestaurant(id, {
      destinationId: parsed.data.destinationId,
      name: parsed.data.name,
      cuisine: splitCsv(parsed.data.cuisine),
      dietary: splitCsv(parsed.data.dietary),
      lat: typeof parsed.data.lat === 'number' ? parsed.data.lat : undefined,
      lng: typeof parsed.data.lng === 'number' ? parsed.data.lng : undefined,
      priceLevel: typeof parsed.data.priceLevel === 'number' ? parsed.data.priceLevel : undefined,
      rating: typeof parsed.data.rating === 'number' ? parsed.data.rating : undefined,
      imageId: parsed.data.imageId || undefined,
      status: parsed.data.status,
    });
  } catch (err) {
    console.error('[updateRestaurantAction]', err);
    return { ok: false, error: 'Something went wrong. Try again.' };
  }
  revalidatePath('/admin/restaurants');
  redirect('/admin/restaurants');
}

export async function toggleRestaurantPublishAction(id: string) {
  await requireAdminPage();
  await toggleRestaurantPublish(id);
  revalidatePath('/admin/restaurants');
}

export async function deleteRestaurantAction(id: string) {
  await requireAdminPage();
  await deleteRestaurant(id);
  revalidatePath('/admin/restaurants');
}