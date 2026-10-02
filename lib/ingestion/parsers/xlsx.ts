import 'server-only';
import * as XLSX from 'xlsx';

export async function parseXlsx(buffer: Buffer): Promise<string> {
  const workbook = XLSX.read(buffer, { type: 'buffer' });

  const sections: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      raw: false,
      defval: '',
    });

    if (rows.length === 0) continue;

    sections.push(`# Sheet: ${sheetName}`);
    sections.push(`(${rows.length} rows)\n`);

    rows.forEach((row, i) => {
      const entries = Object.entries(row)
        .filter(([, v]) => v != null && String(v).trim() !== '')
        .map(([k, v]) => `${k}: ${v}`)
        .join(' · ');
      sections.push(`Row ${i + 1}: ${entries}`);
    });

    sections.push('');
  }

  return sections.join('\n');
}