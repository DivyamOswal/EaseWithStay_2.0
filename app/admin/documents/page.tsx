import { DocumentsTable } from '@/components/admin/documents-table';
import { DocumentUpload } from '@/components/admin/document-upload';
import { listDocuments, listDestinationsForSelect } from '@/lib/services/documents';

export const dynamic = 'force-dynamic';

export default async function AdminDocumentsPage() {
  const [rows, destinations] = await Promise.all([
    listDocuments(),
    listDestinationsForSelect(),
  ]);

  return (
    <div className="p-9">
      <div className="mb-7">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">Documents</h1>
        <p className="mt-1 text-sm text-[#8A8270]">
          Upload travel guides, policy PDFs, and CSVs. These feed the AI planner through RAG.
        </p>
      </div>

      <DocumentsTable
        initial={rows}
        headerAction={<DocumentUpload destinations={destinations} />}
      />
    </div>
  );
}