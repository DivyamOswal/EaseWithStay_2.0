import 'server-only';

export async function parsePdf(buffer: Buffer): Promise<string> {
  // Dynamic import — pdf-parse is CJS and can confuse Next.js bundler
  const mod = await import('pdf-parse');
  const pdfParse = (mod as unknown as { default: (buf: Buffer) => Promise<{ text: string }> }).default;

  const result = await pdfParse(buffer);
  return result.text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}