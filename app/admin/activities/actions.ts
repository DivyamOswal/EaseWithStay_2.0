'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdminPage } from '@/lib/auth/admin-guard';
import { activitySchema } from '@/lib/validators/activity';
import {
  createActivity,
  updateActivity,
  toggleActivityPublish,
  deleteActivity,
  activitySlugExists,
} from '@/lib/services/activities';

export type ActivityActionState = {
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
    slug: String(fd.get('slug') ?? ''),
    description: String(fd.get('description') ?? ''),
    durationMin: String(fd.get('durationMin') ?? '') || undefined,
    priceMinor: String(fd.get('priceMinor') ?? '0'),
    minAge: String(fd.get('minAge') ?? '') || undefined,
    tags: String(fd.get('tags') ?? ''),
    imageId: String(fd.get('imageId') ?? ''),
    status: String(fd.get('status') ?? 'DRAFT'),
  };
}

export async function createActivityAction(
  _prev: ActivityActionState,
  fd: FormData,
): Promise<ActivityActionState> {
  await requireAdminPage();
  const parsed = activitySchema.safeParse(parseForm(fd));
  if (!parsed.success) {
    return { ok: false, error: 'Please fix the errors below.', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  if (await activitySlugExists(parsed.data.slug)) {
    return { ok: false, error: 'Slug already in use.', fieldErrors: { slug: ['Slug already taken'] } };
  }
  try {
    await createActivity({
      destinationId: parsed.data.destinationId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || undefined,
      durationMin: typeof parsed.data.durationMin === 'number' ? parsed.data.durationMin : undefined,
      priceMinor: parsed.data.priceMinor,
      minAge: typeof parsed.data.minAge === 'number' ? parsed.data.minAge : undefined,
      tags: splitCsv(parsed.data.tags),
      imageId: parsed.data.imageId || undefined,
      status: parsed.data.status,
    });
  } catch (err) {
    console.error('[createActivityAction]', err);
    return { ok: false, error: 'Something went wrong. Try again.' };
  }
  revalidatePath('/admin/activities');
  redirect('/admin/activities');
}

export async function updateActivityAction(
  id: string,
  _prev: ActivityActionState,
  fd: FormData,
): Promise<ActivityActionState> {
  await requireAdminPage();
  const parsed = activitySchema.safeParse(parseForm(fd));
  if (!parsed.success) {
    return { ok: false, error: 'Please fix the errors below.', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  if (await activitySlugExists(parsed.data.slug, id)) {
    return { ok: false, error: 'Slug already in use.', fieldErrors: { slug: ['Slug already taken'] } };
  }
  try {
    await updateActivity(id, {
      destinationId: parsed.data.destinationId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || undefined,
      durationMin: typeof parsed.data.durationMin === 'number' ? parsed.data.durationMin : undefined,
      priceMinor: parsed.data.priceMinor,
      minAge: typeof parsed.data.minAge === 'number' ? parsed.data.minAge : undefined,
      tags: splitCsv(parsed.data.tags),
      imageId: parsed.data.imageId || undefined,
      status: parsed.data.status,
    });
  } catch (err) {
    console.error('[updateActivityAction]', err);
    return { ok: false, error: 'Something went wrong. Try again.' };
  }
  revalidatePath('/admin/activities');
  redirect('/admin/activities');
}

export async function toggleActivityPublishAction(id: string) {
  await requireAdminPage();
  await toggleActivityPublish(id);
  revalidatePath('/admin/activities');
}

export async function deleteActivityAction(id: string) {
  await requireAdminPage();
  await deleteActivity(id);
  revalidatePath('/admin/activities');
}