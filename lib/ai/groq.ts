import 'server-only';
import Groq from 'groq-sdk';
import { env } from '@/lib/env';

export const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

// Production models (current as of 2026)
// GPT-OSS 120B: flagship, best quality for itinerary generation
// GPT-OSS 20B: fast, cheap, good for classification and quick tasks
export const MODEL_MAIN = 'openai/gpt-oss-120b';
export const MODEL_FAST = 'openai/gpt-oss-20b';