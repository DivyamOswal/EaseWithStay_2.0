import 'server-only';

export async function parseText(buffer: Buffer): Promise<string> {
  return buffer
    .toString('utf-8')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}