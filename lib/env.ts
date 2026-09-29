// lib/env.ts
import 'server-only';
import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  DATABASE_URL: z.string().url('DATABASE_URL must be a valid Postgres URL'),
  DIRECT_DATABASE_URL: z.string().url('DIRECT_DATABASE_URL must be a valid Postgres URL'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 chars'),

  IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
  IMAGEKIT_URL_ENDPOINT: z.string().url(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().min(1),
});

function parseEnv() {
  const server = serverSchema.safeParse(process.env);
  if (!server.success) {
    console.error('❌ Invalid server env:');
    console.error(server.error.flatten().fieldErrors);
    throw new Error('Invalid server environment variables');
  }

  const client = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  });
  if (!client.success) {
    console.error('❌ Invalid client env:');
    console.error(client.error.flatten().fieldErrors);
    throw new Error('Invalid client environment variables');
  }

  return { ...server.data, ...client.data };
}

export const env = parseEnv();