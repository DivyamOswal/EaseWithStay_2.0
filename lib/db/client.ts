// lib/db/client.ts
import 'server-only';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { env } from '@/lib/env';

const createPrismaClient = () => {
  const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var __prisma: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') globalThis.__prisma = prisma;