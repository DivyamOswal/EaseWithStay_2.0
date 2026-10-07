'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2 } from 'lucide-react';

type Props = {
  name: string;
  defaultValue?: string;
  folder?: string;
  hint?: string;
};

export function ImageUploadField({
  name,
  defaultValue = '',
  folder = '/destination-heroes',
  hint = 'JPEG, PNG, WebP, AVIF, GIF · up to 5 MB',
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);

      const res = await fetch('/api/v1/admin/uploads/image', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.message ?? data.error ?? 'Upload failed');
        return;
      }
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function handleClear() {
    setUrl('');
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div>
      {/* Hidden input that carries the value to the server action */}
      <input type="hidden" name={name} value={url} />

      {/* Native file picker — opens Windows Explorer / macOS Finder */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {url ? (
        <div className="rounded-lg border border-[var(--color-paper-line)] bg-white p-3">
          <div className="flex items-start gap-3">
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md bg-[#F0EBDD]">
              <Image
                src={url}
                alt="Upload preview"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs text-[#8A8270]">{url}</div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="rounded-md border border-[var(--color-paper-line)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] disabled:opacity-50"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={uploading}
                  className="rounded-md border border-[var(--color-paper-line)] px-2.5 py-1.5 text-xs font-semibold text-[#C94E2C] transition hover:border-[#C94E2C] hover:bg-[#FDEDE7] disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-paper-line)] bg-[#FEFDFA] px-4 py-6 text-sm text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:bg-white disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={16} />
              Choose an image
            </>
          )}
        </button>
      )}

      {!url && !error && (
        <p className="mt-1.5 text-xs text-[#8A8270]">{hint}</p>
      )}

      {error && <p className="mt-1.5 text-xs text-[#C94E2C]">{error}</p>}

      {url && uploading && (
        <p className="mt-1.5 text-xs text-[var(--color-lagoon)]">
          <Loader2 size={12} className="mr-1 inline animate-spin" />
          Uploading replacement…
        </p>
      )}
    </div>
  );
}