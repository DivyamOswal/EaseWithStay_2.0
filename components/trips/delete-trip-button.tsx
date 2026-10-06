'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';

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

  function handleConfirm() {
    setOpen(false);
    startTransition(async () => {
      const res = await fetch(`/api/v1/trips/${tripId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/trips');
        router.refresh();
      } else {
        alert('Could not delete this trip.');
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

      <ConfirmDialog
        open={open}
        title={`Delete "${tripTitle}"?`}
        description="This will permanently remove the trip and its itinerary. This cannot be undone."
        confirmLabel="Delete trip"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}