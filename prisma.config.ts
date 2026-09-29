// prisma.config.ts
import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';
import path from 'node:path';

// Load environment variables from .env.local, then .env as a fallback
loadEnv({ path: path.resolve(process.cwd(), '.env.local') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // The CLI uses this for migrations. Use the direct, non-pooled URL.
    url: env('DIRECT_DATABASE_URL'),
  },
});