import 'server-only';

export async function parseJson(buffer: Buffer): Promise<string> {
  const raw = buffer.toString('utf-8');
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('INVALID_JSON');
  }

  return JSON.stringify(data, null, 2);
}