import 'server-only';
import { prisma } from '@/lib/db/client';
import type { DocumentSourceType, DocumentStatus } from '@/lib/generated/prisma/enums';

export type DocumentRow = {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  sourceType: DocumentSourceType;
  status: DocumentStatus;
  fileUrl: string | null;
  version: number;
  createdAt: Date;
};

export async function listDocuments(filters?: {
  search?: string;
  status?: DocumentStatus | 'ALL';
  destinationId?: string;
}): Promise<DocumentRow[]> {
  const search = filters?.search?.trim() ?? '';
  const status = filters?.status ?? 'ALL';

  const rows = await prisma.destinationDocument.findMany({
    where: {
      ...(status !== 'ALL' ? { status } : {}),
      ...(filters?.destinationId ? { destinationId: filters.destinationId } : {}),
      ...(search
        ? { title: { contains: search, mode: 'insensitive' } }
        : {}),
    },
    select: {
      id: true,
      title: true,
      sourceType: true,
      status: true,
      fileUrl: true,
      version: true,
      createdAt: true,
      destinationId: true,
      destination: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    destinationId: r.destinationId,
    destinationName: r.destination.name,
    sourceType: r.sourceType,
    status: r.status,
    fileUrl: r.fileUrl,
    version: r.version,
    createdAt: r.createdAt,
  }));
}

export type CreateDocumentInput = {
  destinationId: string;
  title: string;
  sourceType: DocumentSourceType;
  fileId: string;
  fileUrl: string;
  filePath: string;
};

export async function createDocument(input: CreateDocumentInput) {
  return prisma.destinationDocument.create({
    data: {
      destinationId: input.destinationId,
      title: input.title,
      sourceType: input.sourceType,
      fileId: input.fileId,
      fileUrl: input.fileUrl,
      filePath: input.filePath,
      status: 'PENDING',
      version: 1,
    },
  });
}

export async function getDocumentById(id: string) {
  return prisma.destinationDocument.findUnique({ where: { id } });
}

export async function deleteDocument(id: string) {
  return prisma.destinationDocument.delete({ where: { id } });
}

export async function listDestinationsForSelect() {
  return prisma.destination.findMany({
    select: { id: true, name: true, status: true },
    orderBy: { name: 'asc' },
  });
}