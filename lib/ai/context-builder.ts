import 'server-only';
import { retrieveTravelKnowledge } from '@/lib/rag/retrieve';

export type BuiltContext = {
  chunks: { documentTitle: string; content: string; similarity: number }[];
  asText: string;
};

export async function buildContext(args: {
  query: string;
  destinationId?: string;
  topK?: number;
}): Promise<BuiltContext> {
  const chunks = await retrieveTravelKnowledge(args.query, {
    destinationId: args.destinationId,
    topK: args.topK ?? 8,
    minSimilarity: 0.2,
  });

  const asText = chunks
    .map(
      (c, i) =>
        `[${i + 1}] (from "${c.documentTitle}", similarity ${c.similarity.toFixed(2)})\n${c.content}`,
    )
    .join('\n\n---\n\n');

  return { chunks, asText };
}