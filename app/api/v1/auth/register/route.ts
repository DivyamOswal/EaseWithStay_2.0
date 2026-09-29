import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validators/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'VALIDATION_ERROR', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ ok: false, error: 'EMAIL_IN_USE' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'USER' },
    select: { id: true, email: true, name: true, role: true },
  });

  const { rawToken, expiresAt } = await createSession(user.id, {
    userAgent: req.headers.get('user-agent') ?? undefined,
    ip: req.headers.get('x-forwarded-for') ?? undefined,
  });

  await setSessionCookie(rawToken, expiresAt);

  return Response.json({ ok: true, user }, { status: 201 });
}