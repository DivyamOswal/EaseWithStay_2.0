import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';

export const runtime = 'nodejs';

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  // Always return 200 to prevent user enumeration
  if (!parsed.success) return Response.json({ ok: true });

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return Response.json({ ok: true });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    },
  });

  // TODO: Phase 17 — send email via Nodemailer + BullMQ
  // For now, log the link so it's testable in dev
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${rawToken}`;
  console.log('[forgot-password] reset link for', email, ':', resetUrl);

  return Response.json({ ok: true });
}