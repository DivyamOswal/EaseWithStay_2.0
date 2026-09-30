'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminPage } from '@/lib/auth/admin-guard';
import { togglePublish, deleteDestination } from '@/lib/services/destinations';

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