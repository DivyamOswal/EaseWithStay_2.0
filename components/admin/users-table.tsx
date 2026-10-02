'use client';

import { useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import type { UserRow } from '@/lib/services/users';
import { updateUserRoleAction } from '@/app/admin/users/actions';
import type { UserRole } from '@/lib/generated/prisma/enums';

type Props = { initial: UserRow[]; currentUserId: string };

const roleStyles: Record<UserRole, string> = {
  ADMIN: 'bg-[var(--color-coral-soft)] text-[var(--color-coral-dark)]',
  SUPPORT: 'bg-[#FBF1DE] text-[var(--color-brass)]',
  USER: 'bg-[#F1EFEA] text-[#8A8270]',
};

export function UsersTable({ initial, currentUserId }: Props) {
  const [rows, setRows] = useState(initial);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'ALL' | UserRole>('ALL');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtered = rows.filter((r) => {
    const matchesRole = role === 'ALL' || r.role === role;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.email.toLowerCase().includes(q) ||
      (r.name ?? '').toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  function handleRoleChange(id: string, next: UserRole) {
    setError(null);
    const previous = rows;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, role: next } : r)));
    startTransition(async () => {
      const res = await updateUserRoleAction(id, next);
      if (!res.ok) {
        setRows(previous);
        setError(
          res.error === 'LAST_ADMIN'
            ? 'Cannot demote the last admin. Promote another user first.'
            : 'Failed to update role.',
        );
      }
    });
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8270]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--color-coral)]"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="rounded-lg border border-[var(--color-paper-line)] bg-white px-3 py-2 text-sm text-[var(--color-pine-2)] outline-none transition focus:border-[var(--color-coral)]"
          >
            <option value="ALL">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPPORT">Support</option>
            <option value="USER">User</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#F5CDB4] bg-[#FDEDE7] px-4 py-3 text-sm text-[#C94E2C]">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-paper-line)] bg-white p-12 text-center">
          <h3 className="font-serif text-lg text-[var(--color-pine)]">
            {rows.length === 0 ? 'No users yet' : 'No matches'}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#7A7261]">
            {rows.length === 0
              ? 'Users appear here once they sign up.'
              : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-paper-line)] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-paper-line)] bg-[#FEFDFA]">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">User</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Trips</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Bookings</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Joined</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#8A8270]">Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const isSelf = r.id === currentUserId;
                return (
                  <tr key={r.id} className="border-b border-[var(--color-paper-line)] last:border-0 hover:bg-[#FEFDFA]">
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-semibold text-[var(--color-pine)]">
                        {r.name ?? '—'}
                        {isSelf && <span className="ml-2 text-xs font-normal text-[#8A8270]">(you)</span>}
                      </div>
                      <div className="text-xs text-[#8A8270]">{r.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[var(--color-pine-2)]">{r.tripCount}</td>
                    <td className="px-5 py-3.5 text-sm text-[var(--color-pine-2)]">{r.bookingCount}</td>
                    <td className="px-5 py-3.5 text-sm text-[#8A8270]">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={r.role}
                        disabled={pending}
                        onChange={(e) => handleRoleChange(r.id, e.target.value as UserRole)}
                        className={`rounded-lg border border-[var(--color-paper-line)] px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide outline-none transition focus:border-[var(--color-coral)] disabled:opacity-50 ${roleStyles[r.role]}`}
                      >
                        <option value="USER">USER</option>
                        <option value="SUPPORT">SUPPORT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <p className="mt-4 text-xs text-[#8A8270]">
          Showing {filtered.length} of {rows.length} {rows.length === 1 ? 'user' : 'users'}
        </p>
      )}
    </>
  );
}