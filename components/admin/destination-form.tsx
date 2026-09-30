'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import slugify from 'slugify';
import type { CreateDestinationState } from '@/app/admin/destinations/actions';
import { createDestinationAction } from '@/app/admin/destinations/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50"
    >
      {pending ? 'Saving…' : 'Save destination'}
    </button>
  );
}

type Props = {
  initialState: CreateDestinationState;
};

export function DestinationForm({ initialState }: Props) {
  const [state, setState] = useState(initialState);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(
        slugify(value, { lower: true, strict: true, trim: true }),
      );
    }
  }

  async function handleSubmit(formData: FormData) {
    const next = await createDestinationAction(state, formData);
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
          Auto-generated from name. Only lowercase letters, numbers, hyphens.
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
            placeholder="West coast · Konkan region"
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
          />
        </div>
      </div>

      {/* Hero image URL */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Hero image
        </label>
        <input
          name="heroImageId"
          placeholder="/images/goa.jpg or https://ik.imagekit.io/..."
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-coral)]"
        />
        <p className="mt-1 text-xs text-[#8A8270]">
          For now, use a path from <code>public/images/</code>. Phase 7 adds ImageKit
          uploads.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
          Description
        </label>
        <textarea
          name="description"
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
          defaultValue="DRAFT"
          className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
        >
          <option value="DRAFT">Draft — not visible to travelers</option>
          <option value="PUBLISHED">Published — live on the site</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-[var(--color-paper-line)] pt-5">
        <SubmitButton />
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