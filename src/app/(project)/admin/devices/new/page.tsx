import DeviceForm from '@/modules/admin/devices/device-form';
import SiteHeader from '@/modules/sidebar/site-header';

export default function CreateDevicePage() {
  return (
    <div>
      <SiteHeader title="Create New Device" />

      <div className="container mx-auto space-y-4 p-5 flex flex-col flex-1">
        <DeviceForm />
      </div>
    </div>
  );
}
