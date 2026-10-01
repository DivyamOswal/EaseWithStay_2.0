'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import slugify from 'slugify';
import type { HotelActionState } from '@/app/admin/hotels/actions';
import {
  createHotelAction,
  updateHotelAction,
} from '@/app/admin/hotels/actions';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

type DestinationOption = { id: string; name: string; status: string };

export type HotelFormValues = {
  id?: string;
  destinationId: string;
  name: string;
  slug: string;
  starRating: number | null;
  address: string;
  description: string;
  imageId: string;
  amenities: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

type Props = {
  mode: 'create' | 'edit';
  destinations: DestinationOption[];
  initialValues?: HotelFormValues;
  initialState?: HotelActionState;
};

export function HotelForm({
  mode,
  destinations,
  initialValues,
  initialState,
}: Props) {
  const [state, setState] = useState<HotelActionState>(
    initialState ?? { ok: false },
  );
  const [name, setName] = useState(initialValues?.name ?? '');
  const [slug, setSlug] = useState(initialValues?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value, { lower: true, strict: true, trim: true }));
    }
  }

  async function handleSubmit(formData: FormData) {
    const next =
      mode === 'create'
        ? await createHotelAction(state, formData)
        : await updateHotelAction(initialValues!.id!, state, formData);
    setState(next);
  }

  const fieldError = (key: string) => state.fieldErrors?.[key]?.[0];

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-5">
      {state.error && (
        <div className="rounded-lg border border-[#F5CDB4] bg-[#FDEDE7] px-4 py-3 text-sm text-[#C94E2C]">
          {state.error}
        </div>
      )}

      {/* Destination */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Destination <span className="text-[#C94E2C]">*</span>
        </label>
        <select
          name="destinationId"
          defaultValue={initialValues?.destinationId ?? ''}
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
        >
          <option value="">— Select a destination —</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
              {d.status !== 'PUBLISHED' ? ` (${d.status.toLowerCase()})` : ''}
            </option>
          ))}
        </select>
        {fieldError('destinationId') && (
          <p className="mt-1 text-xs text-[#C94E2C]">{fieldError('destinationId')}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Hotel name <span className="text-[#C94E2C]">*</span>
        </label>
        <input
          name="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="North Goa Beachfront Resort"
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
        />
        {fieldError('name') && (
          <p className="mt-1 text-xs text-[#C94E2C]">{fieldError('name')}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Slug <span className="text-[#C94E2C]">*</span>
        </label>
        <input
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="north-goa-beachfront-resort"
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
        />
        {fieldError('slug') && (
          <p className="mt-1 text-xs text-[#C94E2C]">{fieldError('slug')}</p>
        )}
      </div>

      {/* Star rating + Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Star rating
          </label>
          <input
            type="number"
            name="starRating"
            defaultValue={initialValues?.starRating ?? ''}
            min={0}
            max={5}
            step={0.5}
            placeholder="4.5"
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Status
          </label>
          <select
            name="status"
            defaultValue={initialValues?.status ?? 'DRAFT'}
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Address
        </label>
        <input
          name="address"
          defaultValue={initialValues?.address ?? ''}
          placeholder="Calangute Beach Road, North Goa"
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
        />
      </div>

      {/* Image */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Image URL
        </label>
        <input
          name="imageId"
          defaultValue={initialValues?.imageId ?? ''}
          placeholder="/images/goa.jpg"
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Amenities
        </label>
        <input
          name="amenities"
          defaultValue={initialValues?.amenities?.join(', ') ?? ''}
          placeholder="Beachfront, Kids' pool, Free cancellation"
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
        />
        <p className="mt-1 text-xs text-[#8A8270]">
          Comma-separated. Each item becomes a tag on the hotel card.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={initialValues?.description ?? ''}
          rows={4}
          placeholder="Family suite with connecting rooms, breakfast included."
          className="w-full resize-none rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-[var(--color-paper-line)] pt-5">
        <SubmitButton label={mode === 'create' ? 'Save hotel' : 'Save changes'} />
        <Link
          href="/admin/hotels"
          className="rounded-lg border-[1.5px] border-[var(--color-paper-line)] px-5 py-2.5 text-sm font-semibold text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}