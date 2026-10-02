import 'server-only';
import { prisma } from '@/lib/db/client';
import { parseDocument } from '@/lib/ingestion/parse';
import { downloadFromUrl } from '@/lib/ingestion/download';

export async function ingestDocument(documentId: string): Promise<void> {
  // 1. Load the document
  const doc = await prisma.destinationDocument.findUnique({
    where: { id: documentId },
  });

  if (!doc) throw new Error('NOT_FOUND');
  if (!doc.fileUrl) throw new Error('NO_FILE_URL');

  // 2. Mark as processing
  await prisma.destinationDocument.update({
    where: { id: documentId },
    data: { status: 'PROCESSING', errorMessage: null },
  });

  try {
    // 3. Download from ImageKit
    const buffer = await downloadFromUrl(doc.fileUrl);

    // 4. Parse
    const parsed = await parseDocument(doc.sourceType, buffer);

    // 5. Save extracted text
    await prisma.destinationDocument.update({
      where: { id: documentId },
      data: {
        parsedContent: parsed.text,
        status: 'PROCESSING', // stays here until Phase 8 embeds
        errorMessage: null,
      },
    });

    console.log(
      `[ingest] ${doc.title}: ${parsed.charCount} chars, ${parsed.wordCount} words`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'UNKNOWN';
    await prisma.destinationDocument.update({
      where: { id: documentId },
      data: { status: 'FAILED', errorMessage: message },
    });
    throw err;
  }
}