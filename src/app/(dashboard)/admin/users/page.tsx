import { getUsers } from '@/modules/admin/users/_services/users.service';
import UsersTable from '@/modules/admin/users/users-table';
import SiteHeader from '@/modules/sidebar/site-header';
import { Separator } from '@/shared/components/ui/separator';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function AdminUsersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.users],
    queryFn: getUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-screen flex-col">
        <SiteHeader title="Manage Users" />

        <div className="container mx-auto flex flex-1 flex-col space-y-4 p-5 pt-20">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Users</h2>
              <p className="text-muted-foreground text-sm">Manage users</p>
            </div>
          </div>

          <Separator />

          <UsersTable />
        </div>
      </div>
    </HydrationBoundary>
  );
}
