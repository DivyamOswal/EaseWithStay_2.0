import { prisma } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
    const tables = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;

    return Response.json({
      ok: true,
      db: 'connected',
      serverTime: result[0]?.now ?? null,
      tableCount: Number(tables[0]?.count ?? 0),
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}