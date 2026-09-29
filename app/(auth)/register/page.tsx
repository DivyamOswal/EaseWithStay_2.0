'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required').max(80),
    email: z.string().email(),
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

type RegisterInput = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(schema) });

  async function onSubmit(data: RegisterInput) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          body.error === 'EMAIL_IN_USE'
            ? 'That email is already registered'
            : 'Registration failed',
        );
        return;
      }
      router.push('/');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8 inline-flex rounded-lg bg-[#F0EBDD] p-1">
        <Link
          href="/login"
          className="rounded-md px-5 py-2 text-sm font-semibold text-[#8A8270]"
        >
          Log in
        </Link>
        <span className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-[var(--color-pine)] shadow-sm">
          Create account
        </span>
      </div>

      <h1 className="font-serif text-3xl text-[var(--color-pine)]">Create your account</h1>
      <p className="mt-2 mb-8 text-sm text-[#7A7261]">
        Takes under a minute  no travel details needed yet.
      </p>

      <button
        type="button"
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border-[1.5px] border-[var(--color-paper-line)] py-3 text-sm font-semibold text-[var(--color-pine-2)] transition hover:border-[var(--color-coral)]"
      >
        🔵 Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-[#8A8270]">
        <span className="h-px flex-1 bg-[var(--color-paper-line)]" />
        or with email
        <span className="h-px flex-1 bg-[var(--color-paper-line)]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Full name
          </label>
          <input
            placeholder="Your name"
            {...register('name')}
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            {...register('email')}
            className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••••"
                {...register('password')}
                className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 pr-11 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8270] hover:text-[var(--color-pine)]"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
              Confirm
            </label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••••"
              {...register('confirm')}
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
            />
            {errors.confirm && (
              <p className="mt-1 text-xs text-red-600">{errors.confirm.message}</p>
            )}
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-[#7A7261]">
          <input type="checkbox" className="mt-0.5" required />
          <span>
            I agree to the{' '}
            <Link href="/terms" className="font-semibold text-[var(--color-lagoon)] hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-semibold text-[var(--color-lagoon)] hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--color-coral)] py-3 font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#7A7261]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-[var(--color-coral)] hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}