import CreateDeviceModal from '@/modules/admin/devices/create-device-modal';
import DevicesTable from '@/modules/admin/devices/devices-table';
import SiteHeader from '@/modules/sidebar/site-header';

export default function AdminDevicesPage() {
  return (
    <div className="h-screen flex flex-col">
      <SiteHeader title="Manage Devices" />

      <div className="container mx-auto space-y-4 p-5 flex flex-col flex-1">
        <div className="flex justify-end">
          <CreateDeviceModal />
        </div>

        <DevicesTable />
      </div>
    </div>
  );
}
