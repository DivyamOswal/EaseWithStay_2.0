'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Za-z]/, 'Must include a letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  });

type Input = z.infer<typeof schema>;

function ResetForm() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Input) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error === 'INVALID_TOKEN' ? 'This reset link is invalid or expired' : 'Reset failed');
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <h1 className="font-serif text-3xl text-[var(--color-pine)]">Password updated</h1>
        <p className="mt-3 text-sm text-[#7A7261]">
          You can now log in with your new password.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-lg bg-[var(--color-coral)] px-5 py-3 font-semibold text-white hover:bg-[var(--color-coral-dark)]"
        >
          Go to log in
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-[var(--color-pine)]">Set a new password</h1>
      <p className="mt-2 mb-8 text-sm text-[#7A7261]">
        Choose a password you haven't used before.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            New password
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Confirm new password
          </label>
          <input
            type="password"
            {...register('confirm')}
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
          />
          {errors.confirm && (
            <p className="mt-1 text-xs text-red-600">{errors.confirm.message}</p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--color-coral)] py-3 font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50"
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[#8A8270]">Loading…</p>}>
      <ResetForm />
    </Suspense>
  );
}