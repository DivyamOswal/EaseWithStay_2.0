import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validators/auth';

export const runtime = 'nodejs';

// Run a fake hash to keep timing constant even for unknown emails
const FAKE_HASH = '$argon2id$v=19$m=19456,t=2,p=1$ZQ5E5H2syUuHmk8JmZc/lQ$0';
// Note: this is a placeholder; the verify will fail but keeps timing similar.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ ok: false, error: 'VALIDATION_ERROR' }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    await verifyPassword(FAKE_HASH, password).catch(() => {});
    return Response.json({ ok: false, error: 'INVALID_CREDENTIALS' }, { status: 401 });
  }

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) {
    return Response.json({ ok: false, error: 'INVALID_CREDENTIALS' }, { status: 401 });
  }

  const { rawToken, expiresAt } = await createSession(user.id, {
    userAgent: req.headers.get('user-agent') ?? undefined,
    ip: req.headers.get('x-forwarded-for') ?? undefined,
  });

  await setSessionCookie(rawToken, expiresAt);

  return Response.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}