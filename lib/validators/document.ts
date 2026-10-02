import { z } from 'zod';

export const documentSchema = z.object({
  destinationId: z.string().min(1, 'Pick a destination'),
  title: z.string().min(2, 'Title is required').max(200),
  sourceType: z.enum(['CSV', 'JSON', 'XLSX', 'PDF', 'TEXT', 'URL']),
});

export type DocumentInput = z.infer<typeof documentSchema>;

// Max upload size: 20 MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;

// Accepted MIME types → source type mapping
export const MIME_TO_SOURCE: Record<string, 'CSV' | 'JSON' | 'XLSX' | 'PDF' | 'TEXT'> = {
  'text/csv': 'CSV',
  'application/csv': 'CSV',
  'application/json': 'JSON',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.ms-excel': 'XLSX',
  'application/pdf': 'PDF',
  'text/plain': 'TEXT',
  'text/markdown': 'TEXT',
};

export function detectSourceType(mimeType: string): 'CSV' | 'JSON' | 'XLSX' | 'PDF' | 'TEXT' | null {
  return MIME_TO_SOURCE[mimeType] ?? null;
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}