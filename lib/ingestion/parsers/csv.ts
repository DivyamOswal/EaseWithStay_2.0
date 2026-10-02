import 'server-only';
import { parse } from 'csv-parse/sync';

export async function parseCsv(buffer: Buffer): Promise<string> {
  const records = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  }) as Record<string, string>[];

  if (records.length === 0) return '';

  // Convert rows to readable lines: "Column: value, Column: value"
  return records
    .map((row, i) => {
      const entries = Object.entries(row)
        .filter(([, v]) => v != null && v !== '')
        .map(([k, v]) => `${k}: ${v}`)
        .join(' · ');
      return `Row ${i + 1}: ${entries}`;
    })
    .join('\n\n');
}