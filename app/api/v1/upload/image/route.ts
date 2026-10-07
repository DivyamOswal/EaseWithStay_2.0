import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { uploadToImageKit } from '@/lib/storage/imagekit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ ok: false, error: 'FORBIDDEN' }, { status: 403 });
  }

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

  if (file.size > MAX_SIZE) {
    return Response.json(
      { ok: false, error: 'FILE_TOO_LARGE', message: 'Max image size is 5 MB' },
      { status: 413 },
    );
  }

  if (!ALLOWED_MIMES.includes(file.type)) {
    return Response.json(
      {
        ok: false,
        error: 'UNSUPPORTED_TYPE',
        message: `"${file.type}" not supported. Use JPEG, PNG, WebP, AVIF, or GIF.`,
      },
      { status: 415 },
    );
  }

  const folder = String(formData.get('folder') ?? '/destination-heroes');

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-').slice(0, 100);

    const uploaded = await uploadToImageKit({
      file: buffer,
      fileName,
      folder,
      tags: ['admin-upload', folder.replace(/^\//, '')],
    });

    return Response.json({
      ok: true,
      url: uploaded.url,
      fileId: uploaded.fileId,
      fileName: uploaded.name,
      size: uploaded.size,
    });
  } catch (err) {
    console.error('[image-upload]', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return Response.json(
      { ok: false, error: 'UPLOAD_FAILED', message },
      { status: 500 },
    );
  }
}