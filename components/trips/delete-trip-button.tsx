'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function DeleteTripButton({
  tripId,
  tripTitle,
}: {
  tripId: string;
  tripTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open && !pending) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, pending]);

  function handleConfirm() {
    if (pending) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/v1/trips/${tripId}`, { method: 'DELETE' });
        if (res.ok) {
          router.push('/trips');
          router.refresh();
        } else {
          alert('Could not delete this trip.');
          setOpen(false);
        }
      } catch {
        alert('Network error. Please try again.');
        setOpen(false);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-[var(--color-paper-line)] px-3.5 py-2.5 text-sm font-semibold text-[#C94E2C] transition hover:border-[#C94E2C] hover:bg-[#FDEDE7] disabled:opacity-50"
      >
        <Trash2 size={14} />
        {pending ? 'Deleting…' : 'Delete'}
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !pending && setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-paper-line)] bg-white p-6 shadow-xl">
            <h2 className="font-serif text-lg text-[var(--color-pine)]">
              Delete &ldquo;{tripTitle}&rdquo;?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5B5343]">
              This will permanently remove the trip and its itinerary. This cannot
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-lg border-[1.5px] border-[var(--color-paper-line)] px-4 py-2.5 text-sm font-semibold text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={pending}
                className="rounded-lg bg-[#C94E2C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A83C1F] disabled:opacity-50"
              >
                {pending ? 'Deleting…' : 'Delete trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}