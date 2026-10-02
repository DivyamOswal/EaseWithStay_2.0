'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminPage } from '@/lib/auth/admin-guard';
import { updateUserRole } from '@/lib/services/users';
import type { UserRole } from '@/lib/generated/prisma/enums';

export async function updateUserRoleAction(id: string, role: UserRole) {
  await requireAdminPage();
  try {
    await updateUserRole(id, role);
    revalidatePath('/admin/users');
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'UNKNOWN';
    return { ok: false, error: message };
  }
}