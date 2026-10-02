import 'server-only';
import ImageKit from '@imagekit/nodejs';
import { env } from '@/lib/env';

export const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Server-side upload to ImageKit.
 * Used by admin document uploads and any backend job that generates assets.
 * Do NOT call from the browser — the private key must stay server-side.
 */
export async function uploadToImageKit(options: {
  file: Buffer;
  fileName: string;
  folder?: string;
  tags?: string[];
}): Promise<{
  fileId: string;
  url: string;
  filePath: string;
  name: string;
  size: number;
}> {
  const response = await imagekit.files.upload({
    file: options.file.toString('base64'),
    fileName: options.fileName,
    folder: options.folder ?? '/destination-documents',
    useUniqueFileName: true,
    tags: options.tags,
  });

  return {
    fileId: response.fileId,
    url: response.url,
    filePath: response.filePath,
    name: response.name,
    size: response.size ?? 0,
  };
}

/**
 * Delete a file from ImageKit by its fileId.
 * Safe to call — throws only on network/auth errors.
 */
export async function deleteFromImageKit(fileId: string): Promise<void> {
  await imagekit.files.delete(fileId);
}

/**
 * Client-side upload auth params.
 * The admin dashboard (client component) calls a route that wraps this
 * to get { token, expire, signature }, then uploads directly to ImageKit
 * without the byte stream passing through our Render server.
 */
export function getImageKitAuthParams() {
  return imagekit.helper.getAuthenticationParameters();
}