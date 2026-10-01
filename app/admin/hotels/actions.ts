'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdminPage } from '@/lib/auth/admin-guard';
import { hotelSchema } from '@/lib/validators/hotel';
import {
  createHotel,
  updateHotel,
  toggleHotelPublish,
  deleteHotel,
  hotelSlugExists,
} from '@/lib/services/hotels';

export type HotelActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function parseAmenities(input: string | undefined): string[] {
  if (!input) return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseForm(formData: FormData) {
  return {
    destinationId: String(formData.get('destinationId') ?? ''),
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    starRating: String(formData.get('starRating') ?? '') || undefined,
    address: String(formData.get('address') ?? ''),
    description: String(formData.get('description') ?? ''),
    imageId: String(formData.get('imageId') ?? ''),
    amenities: String(formData.get('amenities') ?? ''),
    status: String(formData.get('status') ?? 'DRAFT'),
  };
}

export async function createHotelAction(
  _prev: HotelActionState,
  formData: FormData,
): Promise<HotelActionState> {
  await requireAdminPage();

  const parsed = hotelSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (await hotelSlugExists(parsed.data.slug)) {
    return {
      ok: false,
      error: 'That slug is already in use.',
      fieldErrors: { slug: ['Slug already taken'] },
    };
  }

  try {
    await createHotel({
      destinationId: parsed.data.destinationId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      starRating:
        typeof parsed.data.starRating === 'number'
          ? parsed.data.starRating
          : undefined,
      address: parsed.data.address || undefined,
      description: parsed.data.description || undefined,
      imageId: parsed.data.imageId || undefined,
      amenities: parseAmenities(parsed.data.amenities),
      status: parsed.data.status,
    });
  } catch (err) {
    console.error('[createHotelAction]', err);
    return { ok: false, error: 'Something went wrong. Try again.' };
  }

  revalidatePath('/admin/hotels');
  redirect('/admin/hotels');
}

export async function updateHotelAction(
  id: string,
  _prev: HotelActionState,
  formData: FormData,
): Promise<HotelActionState> {
  await requireAdminPage();

  const parsed = hotelSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (await hotelSlugExists(parsed.data.slug, id)) {
    return {
      ok: false,
      error: 'That slug is already in use.',
      fieldErrors: { slug: ['Slug already taken'] },
    };
  }

  try {
    await updateHotel(id, {
      destinationId: parsed.data.destinationId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      starRating:
        typeof parsed.data.starRating === 'number'
          ? parsed.data.starRating
          : undefined,
      address: parsed.data.address || undefined,
      description: parsed.data.description || undefined,
      imageId: parsed.data.imageId || undefined,
      amenities: parseAmenities(parsed.data.amenities),
      status: parsed.data.status,
    });
  } catch (err) {
    console.error('[updateHotelAction]', err);
    return { ok: false, error: 'Something went wrong. Try again.' };
  }

  revalidatePath('/admin/hotels');
  redirect('/admin/hotels');
}

export async function toggleHotelPublishAction(id: string) {
  await requireAdminPage();
  await toggleHotelPublish(id);
  revalidatePath('/admin/hotels');
}

export async function deleteHotelAction(id: string) {
  await requireAdminPage();
  await deleteHotel(id);
  revalidatePath('/admin/hotels');
}