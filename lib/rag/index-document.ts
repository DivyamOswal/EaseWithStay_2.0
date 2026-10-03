import 'server-only';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db/client';
import { chunkText } from './chunk';
import { embedBatch } from './embed';

export async function indexDocument(documentId: string): Promise<{
  chunkCount: number;
  embeddedCount: number;
}> {
  const doc = await prisma.destinationDocument.findUnique({
    where: { id: documentId },
  });

  if (!doc) throw new Error('NOT_FOUND');
  if (!doc.parsedContent) throw new Error('NO_PARSED_CONTENT');

  // Idempotent: wipe existing chunks for this doc
  await prisma.documentChunk.deleteMany({ where: { documentId } });

  const chunks = chunkText(doc.parsedContent);
  if (chunks.length === 0) throw new Error('NO_CHUNKS');

  console.log(`[rag] ${doc.title}: ${chunks.length} chunks created`);

  const BATCH_SIZE = 16;
  const embeddings: number[][] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const batchEmbeddings = await embedBatch(batch.map((c) => c.content));
    embeddings.push(...batchEmbeddings);
    console.log(
      `[rag] embedded ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}`,
    );
  }

  let embeddedCount = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    const embedding = embeddings[i]!;
    const vectorLiteral = `[${embedding.join(',')}]`;

    await prisma.$executeRaw`
      INSERT INTO "DocumentChunk" ("id", "documentId", "content", "tokenCount", "order", "embedding", "createdAt")
      VALUES (
        ${nanoid()},
        ${documentId},
        ${chunk.content},
        ${chunk.tokenCount},
        ${chunk.order},
        ${vectorLiteral}::vector,
        NOW()
      )
    `;
    embeddedCount++;
  }

  await prisma.destinationDocument.update({
    where: { id: documentId },
    data: { status: 'INDEXED', errorMessage: null },
  });

  return { chunkCount: chunks.length, embeddedCount };
}