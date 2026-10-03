import 'server-only';

export type Chunk = {
  content: string;
  order: number;
  tokenCount: number;
};

const DEFAULT_CHUNK_SIZE = 400;
const DEFAULT_OVERLAP = 50;
const CHARS_PER_TOKEN = 4;

export function chunkText(
  text: string,
  options?: { chunkSize?: number; overlap?: number },
): Chunk[] {
  const chunkSize = options?.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlap = options?.overlap ?? DEFAULT_OVERLAP;
  const targetChars = chunkSize * CHARS_PER_TOKEN;
  const overlapChars = overlap * CHARS_PER_TOKEN;

  const trimmed = text.trim();
  if (!trimmed) return [];

  // Split into paragraphs first, then sentences within
  const paragraphs = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const chunks: Chunk[] = [];
  let buffer = '';
  let order = 0;

  for (const para of paragraphs) {
    const candidate = buffer ? buffer + '\n\n' + para : para;

    if (candidate.length > targetChars && buffer.length > 0) {
      chunks.push(makeChunk(buffer, order++));
      const tail = buffer.slice(-overlapChars);
      buffer = (tail + '\n\n' + para).trim();
    } else {
      buffer = candidate;
    }
  }

  if (buffer.length > 0) {
    chunks.push(makeChunk(buffer, order));
  }

  return chunks;
}

function makeChunk(content: string, order: number): Chunk {
  const t = content.trim();
  return {
    content: t,
    order,
    tokenCount: Math.ceil(t.length / CHARS_PER_TOKEN),
  };
}