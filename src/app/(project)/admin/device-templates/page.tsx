import DeviceTemplatesTable from '@/modules/admin/device-templates/device-templates-table';
import SiteHeader from '@/modules/sidebar/site-header';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { PATHS } from '@/shared/config/paths';
import Link from 'next/link';

export default function AdminDevicesPage() {
  return (
    <div className="flex h-screen flex-col">
      <SiteHeader title="Manage Devices" />

      <div className="container mx-auto flex flex-1 flex-col space-y-4 p-5 pt-20">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Device Templates</h2>
            <p className="text-muted-foreground text-sm">Manage device templates</p>
          </div>

          <Button asChild>
            <Link href={PATHS.admin.deviceTemplates.new}>Create New Device Templates</Link>
          </Button>
        </div>

        <Separator />

        <DeviceTemplatesTable />
      </div>
    </div>
  );
}
