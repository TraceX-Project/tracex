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
      <SiteHeader title="Manage Users" />

      <div className="container mx-auto flex flex-1 flex-col space-y-4 p-5 pt-20">
        <UsersTable />
      </div>
    </HydrationBoundary>
  );
}
