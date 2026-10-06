import { redirect } from 'next/navigation';
import { SiteNav } from '@/components/layout/site-nav';
import { PlannerClient } from '@/components/planner/planner-client';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export default async function PlannerPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/planner');

  const destinations = await prisma.destination.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <SiteNav />
      <PlannerClient destinations={destinations} />
    </>
  );
}