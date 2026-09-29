-- This is an empty migration.
CREATE INDEX IF NOT EXISTS "DocumentChunk_embedding_hnsw_idx"
  ON "DocumentChunk"
  USING hnsw ("embedding" vector_cosine_ops);