'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import slugify from 'slugify';
import type { ActivityActionState } from '@/app/admin/activities/actions';
import { createActivityAction, updateActivityAction } from '@/app/admin/activities/actions';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50">
      {pending ? 'Saving…' : label}
    </button>
  );
}

type DestinationOption = { id: string; name: string; status: string };

export type ActivityFormValues = {
  id?: string;
  destinationId: string;
  name: string;
  slug: string;
  description: string;
  durationMin: number | null;
  priceMinor: number;
  minAge: number | null;
  tags: string[];
  imageId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

type Props = {
  mode: 'create' | 'edit';
  destinations: DestinationOption[];
  initialValues?: ActivityFormValues;
  initialState?: ActivityActionState;
};

export function ActivityForm({ mode, destinations, initialValues, initialState }: Props) {
  const [state, setState] = useState<ActivityActionState>(initialState ?? { ok: false });
  const [name, setName] = useState(initialValues?.name ?? '');
  const [slug, setSlug] = useState(initialValues?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value, { lower: true, strict: true, trim: true }));
  }

  async function handleSubmit(fd: FormData) {
    const next = mode === 'create'
      ? await createActivityAction(state, fd)
      : await updateActivityAction(initialValues!.id!, state, fd);
    setState(next);
  }

  const err = (k: string) => state.fieldErrors?.[k]?.[0];

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-5">
      {state.error && (
        <div className="rounded-lg border border-[#F5CDB4] bg-[#FDEDE7] px-4 py-3 text-sm text-[#C94E2C]">
          {state.error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Destination <span className="text-[#C94E2C]">*</span>
        </label>
        <select name="destinationId" defaultValue={initialValues?.destinationId ?? ''} className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]">
          <option value="">— Select a destination —</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>{d.name}{d.status !== 'PUBLISHED' ? ` (${d.status.toLowerCase()})` : ''}</option>
          ))}
        </select>
        {err('destinationId') && <p className="mt-1 text-xs text-[#C94E2C]">{err('destinationId')}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Name <span className="text-[#C94E2C]">*</span>
        </label>
        <input name="name" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Dolphin-watching cruise" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        {err('name') && <p className="mt-1 text-xs text-[#C94E2C]">{err('name')}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Slug <span className="text-[#C94E2C]">*</span>
        </label>
        <input name="slug" value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} placeholder="dolphin-watching-cruise" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        {err('slug') && <p className="mt-1 text-xs text-[#C94E2C]">{err('slug')}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Price (₹) <span className="text-[#C94E2C]">*</span>
          </label>
          <input
            type="number"
            name="priceMinor"
            defaultValue={initialValues ? initialValues.priceMinor / 100 : ''}
            min={0}
            step={50}
            placeholder="1200"
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
          />
          <p className="mt-1 text-[10.5px] text-[#8A8270]">Enter rupees — stored as paise</p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Duration (min)</label>
          <input type="number" name="durationMin" defaultValue={initialValues?.durationMin ?? ''} min={0} placeholder="120" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Min age</label>
          <input type="number" name="minAge" defaultValue={initialValues?.minAge ?? ''} min={0} max={18} placeholder="6" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Image URL</label>
        <input name="imageId" defaultValue={initialValues?.imageId ?? ''} placeholder="/images/goa.jpg" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Tags</label>
        <input name="tags" defaultValue={initialValues?.tags?.join(', ') ?? ''} placeholder="Kid-friendly, Water, Outdoors" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Description</label>
        <textarea name="description" defaultValue={initialValues?.description ?? ''} rows={3} className="w-full resize-none rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Status</label>
        <select name="status" defaultValue={initialValues?.status ?? 'DRAFT'} className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div className="flex items-center gap-3 border-t border-[var(--color-paper-line)] pt-5">
        <SubmitButton label={mode === 'create' ? 'Save activity' : 'Save changes'} />
        <Link href="/admin/activities" className="rounded-lg border-[1.5px] border-[var(--color-paper-line)] px-5 py-2.5 text-sm font-semibold text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]">Cancel</Link>
      </div>
    </form>
  );
}