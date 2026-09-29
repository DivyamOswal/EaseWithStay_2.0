import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth/password';
import { deleteAllUserSessions } from '@/lib/auth/session';

export const runtime = 'nodejs';

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ ok: false, error: 'VALIDATION_ERROR' }, { status: 400 });
  }

  const { token, password } = parsed.data;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const reset = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    return Response.json({ ok: false, error: 'INVALID_TOKEN' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    }),
  ]);

  // Invalidate all existing sessions for security
  await deleteAllUserSessions(reset.userId);

  return Response.json({ ok: true });
}