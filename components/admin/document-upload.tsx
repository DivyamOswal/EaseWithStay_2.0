'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, FileText } from 'lucide-react';

type DestinationOption = { id: string; name: string; status: string };

type Props = {
  destinations: DestinationOption[];
};

const SOURCE_TYPES = [
  { value: 'CSV', label: 'CSV' },
  { value: 'JSON', label: 'JSON' },
  { value: 'XLSX', label: 'Excel (XLSX)' },
  { value: 'PDF', label: 'PDF' },
  { value: 'TEXT', label: 'Text / Markdown' },
] as const;

export function DocumentUpload({ destinations }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [destinationId, setDestinationId] = useState('');
  const [title, setTitle] = useState('');
  const [sourceType, setSourceType] = useState<typeof SOURCE_TYPES[number]['value']>('CSV');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function reset() {
    setFile(null);
    setDestinationId('');
    setTitle('');
    setSourceType('CSV');
    setError(null);
    setDragOver(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleFile(f: File) {
    setFile(f);
    if (!title) {
      // Auto-fill title from filename (strip extension)
      setTitle(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select a file.');
      return;
    }
    if (!destinationId) {
      setError('Please pick a destination.');
      return;
    }
    if (!title.trim()) {
      setError('Please give this document a title.');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('destinationId', destinationId);
      fd.append('title', title.trim());
      fd.append('sourceType', sourceType);

      const res = await fetch('/api/v1/admin/documents/upload', {
        method: 'POST',
        body: fd,
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.message ?? body.error ?? 'Upload failed');
        return;
      }

      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-coral)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
      >
        <Upload size={15} />
        Upload document
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (!uploading) {
            setOpen(false);
            reset();
          }
        }}
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-lg text-[var(--color-pine)]">
              Upload document
            </h2>
            <p className="mt-1 text-xs text-[#8A8270]">
              Files land in ImageKit, ready for the RAG pipeline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!uploading) {
                setOpen(false);
                reset();
              }
            }}
            disabled={uploading}
            className="rounded-lg p-1.5 text-[#8A8270] transition hover:bg-[#F0EBDD] disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
              dragOver
                ? 'border-[var(--color-coral)] bg-[var(--color-coral-soft)]'
                : 'border-[var(--color-paper-line)] bg-[#FEFDFA] hover:border-[var(--color-coral)]'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.json,.xlsx,.xls,.pdf,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-pine)]">
                <FileText size={16} className="text-[var(--color-lagoon)]" />
                <span className="font-semibold">{file.name}</span>
                <span className="text-[#8A8270]">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
            ) : (
              <>
                <Upload size={22} className="mx-auto mb-2 text-[#8A8270]" />
                <p className="text-sm text-[var(--color-pine-2)]">
                  Drag a file here, or click to browse
                </p>
                <p className="mt-1 text-xs text-[#8A8270]">
                  CSV, JSON, XLSX, PDF, TXT · up to 20 MB
                </p>
              </>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
              Title <span className="text-[#C94E2C]">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goa family travel guide — 2026"
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
              Destination <span className="text-[#C94E2C]">*</span>
            </label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
            >
              <option value="">— Select a destination —</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source type */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
              Source type
            </label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as typeof sourceType)}
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
            >
              {SOURCE_TYPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-lg border border-[#F5CDB4] bg-[#FDEDE7] px-3.5 py-2.5 text-xs text-[#C94E2C]">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-[var(--color-paper-line)] pt-4">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              disabled={uploading}
              className="rounded-lg border-[1.5px] border-[var(--color-paper-line)] px-4 py-2.5 text-sm font-semibold text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-[var(--color-coral)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}