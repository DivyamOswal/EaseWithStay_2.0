import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createDocument } from '@/lib/services/documents';
import { uploadToImageKit } from '@/lib/storage/imagekit';
import {
  documentSchema,
  detectSourceType,
  sanitizeFilename,
  MAX_DOCUMENT_SIZE,
} from '@/lib/validators/document';

export const runtime = 'nodejs';
export const maxDuration = 60; // seconds — imagekit uploads can be slow

export async function POST(req: NextRequest) {
  // 1. Auth
  try {
    await requireAdmin();
  } catch {
    return Response.json({ ok: false, error: 'FORBIDDEN' }, { status: 403 });
  }

  // 2. Parse form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ ok: false, error: 'INVALID_FORM_DATA' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: 'NO_FILE' }, { status: 400 });
  }

  // 3. Validate metadata
  const parsed = documentSchema.safeParse({
    destinationId: formData.get('destinationId'),
    title: formData.get('title'),
    sourceType: formData.get('sourceType'),
  });

  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: 'VALIDATION_ERROR',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // 4. Validate file size
  if (file.size > MAX_DOCUMENT_SIZE) {
    return Response.json(
      {
        ok: false,
        error: 'FILE_TOO_LARGE',
        message: `Max file size is ${Math.round(MAX_DOCUMENT_SIZE / 1024 / 1024)} MB`,
      },
      { status: 413 },
    );
  }

  // 5. Validate mime type
  const detectedSource = detectSourceType(file.type);
  if (!detectedSource) {
    return Response.json(
      {
        ok: false,
        error: 'UNSUPPORTED_FILE_TYPE',
        message: `File type "${file.type}" is not supported`,
      },
      { status: 415 },
    );
  }

  // 6. Upload to ImageKit
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = sanitizeFilename(file.name);

    const uploaded = await uploadToImageKit({
      file: buffer,
      fileName,
      folder: '/destination-documents',
      tags: ['ingestion', parsed.data.destinationId, parsed.data.sourceType],
    });

    // 7. Create DB record
    const doc = await createDocument({
      destinationId: parsed.data.destinationId,
      title: parsed.data.title,
      sourceType: parsed.data.sourceType,
      fileId: uploaded.fileId,
      fileUrl: uploaded.url,
      filePath: uploaded.filePath,
    });

    return Response.json({
      ok: true,
      document: {
        id: doc.id,
        title: doc.title,
        status: doc.status,
        fileUrl: doc.fileUrl,
      },
    });
  } catch (err) {
    console.error('[upload]', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return Response.json({ ok: false, error: 'UPLOAD_FAILED', message }, { status: 500 });
  }
}