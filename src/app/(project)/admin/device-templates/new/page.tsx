import DeviceTemplateForm from '@/modules/admin/device-templates/device-template-form';
import SiteHeader from '@/modules/sidebar/site-header';

export default function CreateDevicePage() {
  return (
    <div>
      <SiteHeader title="Create New Device" />

      <div className="container mx-auto flex flex-1 flex-col space-y-4 p-5 pt-20">
        <DeviceTemplateForm />
      </div>
    </div>
  );
}
