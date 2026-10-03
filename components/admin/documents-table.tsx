'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  FileText,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import type { DocumentRow } from '@/lib/services/documents';
import {
  deleteDocumentAction,
  processDocumentAction,
  indexDocumentAction,
} from '@/app/admin/documents/actions';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';

type Props = {
  initial: DocumentRow[];
  headerAction?: React.ReactNode;
};

const statusStyles: Record<string, string> = {
  PENDING: 'bg-[#FBF1DE] text-[var(--color-brass)]',
  PROCESSING: 'bg-[var(--color-coral-soft)] text-[var(--color-coral-dark)]',
  INDEXED: 'bg-[#EFF6EE] text-[var(--color-success)]',
  FAILED: 'bg-[#FDEDE7] text-[#C94E2C]',
  ARCHIVED: 'bg-[#F1EFEA] text-[#8A8270]',
};

export function DocumentsTable({ initial, headerAction }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<
    'ALL' | 'PENDING' | 'PROCESSING' | 'INDEXED' | 'FAILED' | 'ARCHIVED'
  >('ALL');
  const [pending, startTransition] = useTransition();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [indexingId, setIndexingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(initial);
  }, [initial]);

  const filtered = rows.filter((r) => {
    const matchesStatus = status === 'ALL' || r.status === status;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.destinationName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  function handleDeleteConfirmed() {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(async () => {
      try {
        await deleteDocumentAction(id);
      } catch {
        setRows(initial);
      }
    });
  }

  async function handleProcess(id: string) {
    setOpenMenu(null);
    setError(null);
    setProcessingId(id);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'PROCESSING' as const } : r)),
    );

    const res = await processDocumentAction(id);
    setProcessingId(null);

    if (!res.ok) {
      setError(res.error ?? 'Ingestion failed');
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'FAILED' as const } : r)),
      );
      return;
    }
    router.refresh();
  }

  async function handleIndex(id: string) {
    setOpenMenu(null);
    setError(null);
    setIndexingId(id);

    const res = await indexDocumentAction(id);
    setIndexingId(null);

    if (!res.ok) {
      setError(res.error ?? 'Indexing failed');
      return;
    }

    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'INDEXED' as const } : r)),
    );
    router.refresh();
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8270]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--color-coral)]"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-lg border border-[var(--color-paper-line)] bg-white px-3 py-2 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="INDEXED">Indexed</option>
            <option value="FAILED">Failed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        {headerAction}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#F5CDB4] bg-[#FDEDE7] px-4 py-3 text-sm text-[#C94E2C]">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-paper-line)] bg-white p-12 text-center">
          <FileText size={28} className="mx-auto mb-3 text-[#B7AE96]" />
          <h3 className="font-serif text-lg text-[var(--color-pine)]">
            {rows.length === 0 ? 'No documents yet' : 'No matches'}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#7A7261]">
            {rows.length === 0
              ? 'Upload your first document — travel guides, policy PDFs, or CSVs of hotels and activities.'
              : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-paper-line)] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-paper-line)] bg-[#FEFDFA]">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Document</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Destination</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Type</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Uploaded</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-[var(--color-paper-line)] last:border-0 hover:bg-[#FEFDFA]">
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-semibold text-[var(--color-pine)]">{r.title}</div>
                    <div className="text-xs text-[#8A8270]">v{r.version}</div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-pine-2)]">{r.destinationName}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block rounded bg-[var(--color-lagoon-soft)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--color-lagoon)]">
                      {r.sourceType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#8A8270]">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="relative px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                      className="rounded-lg p-1.5 text-[#8A8270] transition hover:bg-[#F0EBDD] hover:text-[var(--color-pine)]"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenu === r.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-3 top-full z-20 mt-1 w-48 rounded-lg border border-[var(--color-paper-line)] bg-white py-1 shadow-lg">
                          {(r.status === 'PENDING' || r.status === 'FAILED') && (
                            <button
                              type="button"
                              onClick={() => handleProcess(r.id)}
                              disabled={pending || processingId === r.id}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[var(--color-lagoon)] transition hover:bg-[#FEFDFA] disabled:opacity-50"
                            >
                              <Sparkles size={14} />
                              Process
                            </button>
                          )}
                          {r.status === 'PROCESSING' && (
                            <button
                              type="button"
                              onClick={() => handleIndex(r.id)}
                              disabled={pending || indexingId === r.id}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[var(--color-coral)] transition hover:bg-[#FEFDFA] disabled:opacity-50"
                            >
                              {indexingId === r.id ? (
                                <>
                                  <RefreshCw size={14} className="animate-spin" />
                                  Indexing…
                                </>
                              ) : (
                                <>
                                  <Sparkles size={14} />
                                  Index for AI
                                </>
                              )}
                            </button>
                          )}
                          {r.fileUrl && (
                            <a
                              href={r.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[var(--color-pine-2)] transition hover:bg-[#FEFDFA]"
                            >
                              <ExternalLink size={14} />
                              View in ImageKit
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenu(null);
                              setDeleteTarget({ id: r.id, title: r.title });
                            }}
                            disabled={pending}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#C94E2C] transition hover:bg-[#FDEDE7] disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <p className="mt-4 text-xs text-[#8A8270]">
          Showing {filtered.length} of {rows.length} {rows.length === 1 ? 'document' : 'documents'}
        </p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title ?? ''}"?`}
        description="This will permanently remove the document from ImageKit and the database, along with any chunks already generated from it. This cannot be undone."
        confirmLabel="Delete document"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}