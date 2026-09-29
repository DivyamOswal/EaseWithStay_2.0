'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get('next') ?? '/';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          body.error === 'INVALID_CREDENTIALS'
            ? 'Invalid email or password'
            : 'Login failed',
        );
        return;
      }
      router.push(nextPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-[var(--color-pine)]">Welcome back</h1>
      <p className="mt-2 mb-8 text-sm text-[#7A7261]">
        Log in to see your trips and continue planning.
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

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-pine-2)]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••"
              {...register('password')}
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white px-3.5 py-3 pr-11 text-sm outline-none transition focus:border-[var(--color-coral)] focus:ring-[3px] focus:ring-[rgba(45,108,223,0.35)]"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8270] hover:text-[var(--color-pine)]"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="-mt-1 text-right">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[var(--color-lagoon)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--color-coral)] py-3 font-semibold text-white transition hover:bg-[var(--color-coral-dark)] disabled:opacity-50"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#7A7261]">
        No account?{' '}
        <Link
          href="/register"
          className="font-semibold text-[var(--color-coral)] hover:underline"
        >
          Create one
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[#8A8270]">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}