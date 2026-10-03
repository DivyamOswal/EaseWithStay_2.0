import 'server-only';
import { prisma } from '@/lib/db/client';
import { embedText } from './embed';

export type RetrievedChunk = {
  id: string;
  content: string;
  order: number;
  documentId: string;
  documentTitle: string;
  similarity: number;
};

type RawRow = {
  id: string;
  content: string;
  order: number;
  documentId: string;
  documentTitle: string;
  similarity: number;
};

export async function retrieveTravelKnowledge(
  query: string,
  options?: {
    destinationId?: string;
    topK?: number;
    minSimilarity?: number;
  },
): Promise<RetrievedChunk[]> {
  const topK = options?.topK ?? 8;
  const minSimilarity = options?.minSimilarity ?? 0.25;

  const queryEmbedding = await embedText(query);
  const vectorLiteral = `[${queryEmbedding.join(',')}]`;

  let rows: RawRow[];

  if (options?.destinationId) {
    rows = await prisma.$queryRaw<RawRow[]>`
      SELECT
        c."id"          AS "id",
        c."content"     AS "content",
        c."order"       AS "order",
        c."documentId"  AS "documentId",
        d."title"       AS "documentTitle",
        1 - (c."embedding" <=> ${vectorLiteral}::vector) AS "similarity"
      FROM "DocumentChunk" c
      JOIN "DestinationDocument" d ON d."id" = c."documentId"
      WHERE d."status" = 'INDEXED'
        AND d."destinationId" = ${options.destinationId}
        AND c."embedding" IS NOT NULL
      ORDER BY c."embedding" <=> ${vectorLiteral}::vector
      LIMIT ${topK}
    `;
  } else {
    rows = await prisma.$queryRaw<RawRow[]>`
      SELECT
        c."id"          AS "id",
        c."content"     AS "content",
        c."order"       AS "order",
        c."documentId"  AS "documentId",
        d."title"       AS "documentTitle",
        1 - (c."embedding" <=> ${vectorLiteral}::vector) AS "similarity"
      FROM "DocumentChunk" c
      JOIN "DestinationDocument" d ON d."id" = c."documentId"
      WHERE d."status" = 'INDEXED'
        AND c."embedding" IS NOT NULL
      ORDER BY c."embedding" <=> ${vectorLiteral}::vector
      LIMIT ${topK}
    `;
  }

  return rows
    .map((r) => ({ ...r, similarity: Number(r.similarity) }))
    .filter((r) => r.similarity >= minSimilarity);
}