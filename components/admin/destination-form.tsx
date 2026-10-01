'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import slugify from 'slugify';
import type { CreateDestinationState } from '@/app/admin/destinations/actions';
import {
  createDestinationAction,
  updateDestinationAction,
} from '@/app/admin/destinations/actions';

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

export type DestinationFormValues = {
  id?: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  heroImageId: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

type Props = {
  mode: 'create' | 'edit';
  initialValues?: DestinationFormValues;
  initialState?: CreateDestinationState;
};

export function DestinationForm({
  mode,
  initialValues,
  initialState,
}: Props) {
  const [state, setState] = useState<CreateDestinationState>(
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
        ? await createDestinationAction(state, formData)
        : await updateDestinationAction(initialValues!.id!, state, formData);
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

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Name <span className="text-[#C94E2C]">*</span>
        </label>
        <input
          name="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Goa, India"
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#8A8270]">/destinations/</span>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="goa"
            className="flex-1 rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
          />
        </div>
        <p className="mt-1 text-xs text-[#8A8270]">
          Only lowercase letters, numbers, hyphens.
        </p>
        {fieldError('slug') && (
          <p className="mt-1 text-xs text-[#C94E2C]">{fieldError('slug')}</p>
        )}
      </div>

      {/* Country + Region */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Country <span className="text-[#C94E2C]">*</span>
          </label>
          <input
            name="country"
            defaultValue={initialValues?.country ?? ''}
            placeholder="India"
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
          />
          {fieldError('country') && (
            <p className="mt-1 text-xs text-[#C94E2C]">{fieldError('country')}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Region
          </label>
          <input
            name="region"
            defaultValue={initialValues?.region ?? ''}
            placeholder="West coast · Konkan region"
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
          />
        </div>
      </div>

      {/* Hero image */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Hero image
        </label>
        <input
          name="heroImageId"
          defaultValue={initialValues?.heroImageId ?? ''}
          placeholder="/images/goa.jpg or https://ik.imagekit.io/..."
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
        />
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
          placeholder="A short paragraph shown on the destination details page."
          className="w-full resize-none rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
        />
      </div>

      {/* Status */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Status
        </label>
        <select
          name="status"
          defaultValue={initialValues?.status ?? 'DRAFT'}
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
        >
          <option value="DRAFT">Draft — not visible to travelers</option>
          <option value="PUBLISHED">Published — live on the site</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-[var(--color-paper-line)] pt-5">
        <SubmitButton label={mode === 'create' ? 'Save destination' : 'Save changes'} />
        <Link
          href="/admin/destinations"
          className="rounded-lg border-[1.5px] border-[var(--color-paper-line)] px-5 py-2.5 text-sm font-semibold text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)] hover:text-[var(--color-coral)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}