'use client';

import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ email: z.string().email() });
type Input = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Input) {
    setLoading(true);
    try {
      await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <>
        <h1 className="font-serif text-3xl text-[var(--color-pine)]">Check your email</h1>
        <p className="mt-3 text-sm text-[#7A7261]">
          If an account exists for that email, we've sent a reset link. It expires in 30
          minutes.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block text-sm font-semibold text-[var(--color-coral)] hover:underline"
        >
          ← Back to log in
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-[var(--color-pine)]">Reset your password</h1>
      <p className="mt-2 mb-8 text-sm text-[#7A7261]">
        Enter the email on your account and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Email
          </label>
          <input
            type="email"
            placeholder="you@email.com"
            {...register('email')}
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--color-coral)] py-3 font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-semibold text-[var(--color-lagoon)] hover:underline"
        >
          ← Back to log in
        </Link>
      </div>
    </>
  );
}