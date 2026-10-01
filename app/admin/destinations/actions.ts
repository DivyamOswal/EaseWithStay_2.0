'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminPage } from '@/lib/auth/admin-guard';
import { togglePublish, deleteDestination } from '@/lib/services/destinations';
import { destinationSchema } from '@/lib/validators/destination';
import { createDestination, slugExists } from '@/lib/services/destinations';
import { redirect } from 'next/navigation';
import { updateDestination } from '@/lib/services/destinations';

export async function togglePublishAction(id: string) {
  await requireAdminPage();
  await togglePublish(id);
  revalidatePath('/admin/destinations');
}

export async function deleteDestinationAction(id: string) {
  await requireAdminPage();
  await deleteDestination(id);
  revalidatePath('/admin/destinations');
}

export type CreateDestinationState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createDestinationAction(
  _prev: CreateDestinationState,
  formData: FormData,
): Promise<CreateDestinationState> {
  await requireAdminPage();

  const raw = {
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    country: String(formData.get('country') ?? ''),
    region: String(formData.get('region') ?? ''),
    description: String(formData.get('description') ?? ''),
    heroImageId: String(formData.get('heroImageId') ?? ''),
    status: String(formData.get('status') ?? 'DRAFT'),
  };

  const parsed = destinationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const exists = await slugExists(parsed.data.slug);
  if (exists) {
    return {
      ok: false,
      error: 'That slug is already in use.',
      fieldErrors: { slug: ['Slug already taken'] },
    };
  }

  try {
    await createDestination(parsed.data);
  } catch (err) {
    console.error('[createDestinationAction]', err);
    return { ok: false, error: 'Something went wrong. Try again.' };
  }

  revalidatePath('/admin/destinations');
  redirect('/admin/destinations');
}


export async function updateDestinationAction(
  id: string,
  _prev: CreateDestinationState,
  formData: FormData,
): Promise<CreateDestinationState> {
  await requireAdminPage();

  const raw = {
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    country: String(formData.get('country') ?? ''),
    region: String(formData.get('region') ?? ''),
    description: String(formData.get('description') ?? ''),
    heroImageId: String(formData.get('heroImageId') ?? ''),
    status: String(formData.get('status') ?? 'DRAFT'),
  };

  const parsed = destinationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const exists = await slugExists(parsed.data.slug, id);
  if (exists) {
    return {
      ok: false,
      error: 'That slug is already in use.',
      fieldErrors: { slug: ['Slug already taken'] },
    };
  }

  try {
    await updateDestination(id, parsed.data);
  } catch (err) {
    console.error('[updateDestinationAction]', err);
    return { ok: false, error: 'Something went wrong. Try again.' };
  }

  revalidatePath('/admin/destinations');
  redirect('/admin/destinations');
}