import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { retrieveTravelKnowledge } from '@/lib/rag/retrieve';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ ok: false, error: 'FORBIDDEN' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const query = typeof body?.query === 'string' ? body.query.trim() : '';

  if (!query) {
    return Response.json({ ok: false, error: 'NO_QUERY' }, { status: 400 });
  }

  const start = Date.now();
  const results = await retrieveTravelKnowledge(query, {
    destinationId:
      typeof body?.destinationId === 'string' ? body.destinationId : undefined,
    topK: typeof body?.topK === 'number' ? body.topK : 5,
  });
  const elapsedMs = Date.now() - start;

  return Response.json({
    ok: true,
    query,
    elapsedMs,
    count: results.length,
    results: results.map((r) => ({
      similarity: r.similarity.toFixed(3),
      documentTitle: r.documentTitle,
      content: r.content.slice(0, 300) + (r.content.length > 300 ? '…' : ''),
    })),
  });
}