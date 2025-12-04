import { getDeviceTemplates } from '@/modules/admin/device-templates/_services/device-templates.service';
import DeviceTemplatesTable from '@/modules/admin/device-templates/device-templates-table';
import SiteHeader from '@/modules/sidebar/site-header';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { PATHS } from '@/shared/config/paths';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDevicesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.deviceTemplates],
    queryFn: getDeviceTemplates,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SiteHeader title="Manage Devices" />

      <div className="container mx-auto flex flex-1 flex-col space-y-4 p-5 pt-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Button asChild>
            <Link href={PATHS.admin.deviceTemplates.new} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Template
            </Link>
          </Button>
        </div>

        <Separator />

        <DeviceTemplatesTable />
      </div>
    </HydrationBoundary>
  );
}
