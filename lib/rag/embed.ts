import 'server-only';
import {
  pipeline,
  type FeatureExtractionPipeline,
} from '@huggingface/transformers';

const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

declare global {
  // eslint-disable-next-line no-var
  var __embedPipeline: FeatureExtractionPipeline | undefined;
}

async function getPipeline(): Promise<FeatureExtractionPipeline> {
  if (globalThis.__embedPipeline) return globalThis.__embedPipeline;

  console.log('[rag] loading embedding model (first run ~30s)…');

  const pipe = (await pipeline(
    'feature-extraction',
    MODEL_ID,
  )) as FeatureExtractionPipeline;

  globalThis.__embedPipeline = pipe;
  console.log('[rag] embedding model ready');
  return pipe;
}

export const EMBEDDING_DIM = 384;

export async function embedText(text: string): Promise<number[]> {
  const pipe = await getPipeline();
  const output = await pipe(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data as Float32Array);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const pipe = await getPipeline();
  const output = await pipe(texts, { pooling: 'mean', normalize: true });
  const dims = output.dims as number[];
  const dim = dims[dims.length - 1] ?? EMBEDDING_DIM;
  const flat = output.data as Float32Array;
  const result: number[][] = [];
  for (let i = 0; i < texts.length; i++) {
    const start = i * dim;
    result.push(Array.from(flat.slice(start, start + dim)));
  }
  return result;
}