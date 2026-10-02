'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminPage } from '@/lib/auth/admin-guard';
import { deleteDocument, getDocumentById } from '@/lib/services/documents';
import { deleteFromImageKit } from '@/lib/storage/imagekit';

export async function deleteDocumentAction(id: string) {
  await requireAdminPage();

  const doc = await getDocumentById(id);
  if (!doc) return;

  // Delete from ImageKit first
  if (doc.fileId) {
    try {
      await deleteFromImageKit(doc.fileId);
    } catch (err) {
      // Log but don't block DB delete — a stray ImageKit file is recoverable
      console.error('[deleteDocumentAction] imagekit delete failed:', err);
    }
  }

  // Delete DB row (cascades to chunks via relation)
  await deleteDocument(id);

  revalidatePath('/admin/documents');
}