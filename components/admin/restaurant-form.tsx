'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import type { RestaurantActionState } from '@/app/admin/restaurants/actions';
import { createRestaurantAction, updateRestaurantAction } from '@/app/admin/restaurants/actions';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50">
      {pending ? 'Saving…' : label}
    </button>
  );
}

type DestinationOption = { id: string; name: string; status: string };

export type RestaurantFormValues = {
  id?: string;
  destinationId: string;
  name: string;
  cuisine: string[];
  dietary: string[];
  lat: number | null;
  lng: number | null;
  priceLevel: number | null;
  rating: number | null;
  imageId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

type Props = {
  mode: 'create' | 'edit';
  destinations: DestinationOption[];
  initialValues?: RestaurantFormValues;
  initialState?: RestaurantActionState;
};

export function RestaurantForm({ mode, destinations, initialValues, initialState }: Props) {
  const [state, setState] = useState<RestaurantActionState>(initialState ?? { ok: false });

  async function handleSubmit(fd: FormData) {
    const next = mode === 'create'
      ? await createRestaurantAction(state, fd)
      : await updateRestaurantAction(initialValues!.id!, state, fd);
    setState(next);
  }

  const err = (k: string) => state.fieldErrors?.[k]?.[0];

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-5">
      {state.error && (
        <div className="rounded-lg border border-[#F5CDB4] bg-[#FDEDE7] px-4 py-3 text-sm text-[#C94E2C]">{state.error}</div>
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
        <input name="name" defaultValue={initialValues?.name ?? ''} placeholder="Vinayak Family Restaurant" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        {err('name') && <p className="mt-1 text-xs text-[#C94E2C]">{err('name')}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Cuisine</label>
          <input name="cuisine" defaultValue={initialValues?.cuisine?.join(', ') ?? ''} placeholder="Indian, Goan" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Dietary</label>
          <input name="dietary" defaultValue={initialValues?.dietary?.join(', ') ?? ''} placeholder="Vegetarian, Jain" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Rating</label>
          <input type="number" name="rating" defaultValue={initialValues?.rating ?? ''} min={0} max={5} step={0.1} placeholder="4.5" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Price (1–4)</label>
          <input type="number" name="priceLevel" defaultValue={initialValues?.priceLevel ?? ''} min={1} max={4} placeholder="2" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Lat</label>
          <input type="number" name="lat" defaultValue={initialValues?.lat ?? ''} step="any" placeholder="15.54" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Lng</label>
          <input type="number" name="lng" defaultValue={initialValues?.lng ?? ''} step="any" placeholder="73.75" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Image URL</label>
        <input name="imageId" defaultValue={initialValues?.imageId ?? ''} placeholder="/images/goa.jpg" className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">Status</label>
        <select name="status" defaultValue={initialValues?.status ?? 'DRAFT'} className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div className="flex items-center gap-3 border-t border-[var(--color-paper-line)] pt-5">
        <SubmitButton label={mode === 'create' ? 'Save restaurant' : 'Save changes'} />
        <Link href="/admin/restaurants" className="rounded-lg border-[1.5px] border-[var(--color-paper-line)] px-5 py-2.5 text-sm font-semibold text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]">Cancel</Link>
      </div>
    </form>
  );
}