'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Search, Plus, MoreHorizontal, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { DestinationRow } from '@/lib/services/destinations';
import { togglePublishAction, deleteDestinationAction } from '@/app/admin/destinations/actions';
import { Pencil } from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';

type Props = { initial: DestinationRow[] };

const statusStyles: Record<string, string> = {
  PUBLISHED: 'bg-[#EFF6EE] text-[var(--color-success)]',
  DRAFT: 'bg-[#FBF1DE] text-[var(--color-brass)]',
  ARCHIVED: 'bg-[#F1EFEA] text-[#8A8270]',
};

export function DestinationsTable({ initial }: Props) {
  const [rows, setRows] = useState(initial);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('ALL');
  const [pending, startTransition] = useTransition();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filtered = rows.filter((r) => {
    const matchesStatus = status === 'ALL' || r.status === status;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.slug.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  function handleToggle(id: string) {
    setOpenMenu(null);
    // Optimistic: flip locally immediately
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
              publishedAt: r.status === 'PUBLISHED' ? null : new Date(),
            }
          : r,
      ),
    );
    startTransition(async () => {
      try {
        await togglePublishAction(id);
      } catch {
        // Revert on failure  refetch on next navigation
        setRows(initial);
      }
    });
  }

  function handleDeleteConfirmed() {
  if (!deleteTarget) return;
  const { id } = deleteTarget;
  setDeleteTarget(null);
  setRows((prev) => prev.filter((r) => r.id !== id));
  startTransition(async () => {
    try {
      await deleteDestinationAction(id);
    } catch {
      setRows(initial);
    }
  });
}

  return (
    <>
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#8A8270]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations…"
              className="w-full rounded-lg border border-[var(--color-paper-line)] bg-white py-2 pr-3 pl-9 text-sm transition outline-none focus:border-[var(--color-coral)]"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-lg border border-[var(--color-paper-line)] bg-white px-3 py-2 text-sm text-[var(--color-pine-2)] transition outline-none focus:border-[var(--color-coral)]"
          >
            <option value="ALL">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-coral)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
        >
          <Plus size={15} />
          New destination
        </Link>
      </div>

      {/* Table or empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-paper-line)] bg-white p-12 text-center">
          <h3 className="font-serif text-lg text-[var(--color-pine)]">
            {rows.length === 0 ? 'No destinations yet' : 'No matches'}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#7A7261]">
            {rows.length === 0
              ? 'Run the seed script (below) or create your first destination.'
              : 'Try a different search or filter.'}
          </p>
          {rows.length === 0 && (
            <Link
              href="/admin/destinations/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
            >
              <Plus size={15} />
              New destination
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-paper-line)] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-paper-line)] bg-[#FEFDFA]">
                <th className="px-5 py-3 text-left text-[11px] font-bold tracking-wide text-[#8A8270] uppercase">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold tracking-wide text-[#8A8270] uppercase">
                  Country
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold tracking-wide text-[#8A8270] uppercase">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold tracking-wide text-[#8A8270] uppercase">
                  Updated
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[var(--color-paper-line)] last:border-0 hover:bg-[#FEFDFA]"
                >
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-semibold text-[var(--color-pine)]">{r.name}</div>
                    <div className="text-xs text-[#8A8270]">/{r.slug}</div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-pine-2)]">{r.country}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide uppercase ${statusStyles[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#8A8270]">
                    {new Date(r.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="relative px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                      className="rounded-lg p-1.5 text-[#8A8270] transition hover:bg-[#F0EBDD] hover:text-[var(--color-pine)]"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenu === r.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute top-full right-3 z-20 mt-1 w-44 rounded-lg border border-[var(--color-paper-line)] bg-white py-1 shadow-lg">
                          <Link
                            href={`/admin/destinations/${r.id}/edit`}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[var(--color-pine-2)] transition hover:bg-[#FEFDFA]"
                          >
                            <Pencil size={14} />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleToggle(r.id)}
                            disabled={pending}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[var(--color-pine-2)] transition hover:bg-[#FEFDFA] disabled:opacity-50"
                          >
                            {r.status === 'PUBLISHED' ? (
                              <>
                                <EyeOff size={14} />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye size={14} />
                                Publish
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
  setOpenMenu(null);
  setDeleteTarget({ id: r.id, name: r.name });
}}
                            disabled={pending}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#C94E2C] transition hover:bg-[#FDEDE7] disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                        <ConfirmDialog
  open={!!deleteTarget}
  title={`Delete "${deleteTarget?.name ?? ''}"?`}
  description="This will permanently remove the destination and any hotels, activities, or documents linked to it. This cannot be undone."
  confirmLabel="Delete destination"
  onConfirm={handleDeleteConfirmed}
  onCancel={() => setDeleteTarget(null)}
/>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer summary */}
      {filtered.length > 0 && (
        <p className="mt-4 text-xs text-[#8A8270]">
          Showing {filtered.length} of {rows.length}{' '}
          {rows.length === 1 ? 'destination' : 'destinations'}
        </p>
      )}
    </>
  );
}
