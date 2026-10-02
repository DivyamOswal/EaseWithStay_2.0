-- This is an empty migration.

-- Drop the old HNSW index (dimensions must match)
DROP INDEX IF EXISTS "DocumentChunk_embedding_hnsw_idx";

-- Change the vector column dimension
-- Existing rows have NULL embeddings, so this is safe
ALTER TABLE "DocumentChunk"
  ALTER COLUMN "embedding" TYPE vector(384)
  USING NULL;

-- Recreate the HNSW index with the new dimension
CREATE INDEX IF NOT EXISTS "DocumentChunk_embedding_hnsw_idx"
  ON "DocumentChunk"
  USING hnsw ("embedding" vector_cosine_ops);