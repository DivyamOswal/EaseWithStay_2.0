import 'server-only';
import type { DocumentSourceType } from '@/lib/generated/prisma/enums';
import { parseCsv } from './parsers/csv';
import { parseJson } from './parsers/json';
import { parseXlsx } from './parsers/xlsx';
import { parsePdf } from './parsers/pdf';
import { parseText } from './parsers/text';

export type ParseResult = {
  text: string;
  charCount: number;
  wordCount: number;
};

export async function parseDocument(
  sourceType: DocumentSourceType,
  buffer: Buffer,
): Promise<ParseResult> {
  let text: string;

  switch (sourceType) {
    case 'CSV':
      text = await parseCsv(buffer);
      break;
    case 'JSON':
      text = await parseJson(buffer);
      break;
    case 'XLSX':
      text = await parseXlsx(buffer);
      break;
    case 'PDF':
      text = await parsePdf(buffer);
      break;
    case 'TEXT':
    case 'URL':
      text = await parseText(buffer);
      break;
    default:
      throw new Error(`Unsupported source type: ${sourceType}`);
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error('NO_CONTENT');
  }

  const words = trimmed.split(/\s+/).filter(Boolean);

  return {
    text: trimmed,
    charCount: trimmed.length,
    wordCount: words.length,
  };
}