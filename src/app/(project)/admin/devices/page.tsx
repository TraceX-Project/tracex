import DevicesTable from '@/modules/admin/devices/devices-table';
import SiteHeader from '@/modules/sidebar/site-header';
import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';
import Link from 'next/link';

export default function AdminDevicesPage() {
  return (
    <div className="h-screen flex flex-col">
      <SiteHeader title="Manage Devices" />

      <div className="container mx-auto space-y-4 p-5 flex flex-col flex-1 pt-20">
        <div className="flex justify-end">
          <Button>
            <Link href={PATHS.admin.devices.new}>Create New Device</Link>
          </Button>
        </div>

        <DevicesTable />
      </div>
    </div>
  );
}
