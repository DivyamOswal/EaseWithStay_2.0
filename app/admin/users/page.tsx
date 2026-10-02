import { UsersTable } from '@/components/admin/users-table';
import { listUsers } from '@/lib/services/users';
import { requireAdminPage } from '@/lib/auth/admin-guard';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const [rows, admin] = await Promise.all([listUsers(), requireAdminPage('/admin/users')]);

  return (
    <div className="p-9">
      <div className="mb-7">
        <h1 className="font-serif text-2xl text-[var(--color-pine)]">Users</h1>
        <p className="mt-1 text-sm text-[#8A8270]">
          Change roles from the dropdown. The last admin cannot be demoted.
        </p>
      </div>

      <UsersTable initial={rows} currentUserId={admin.id} />
    </div>
  );
}