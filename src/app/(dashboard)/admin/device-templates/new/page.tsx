import DeviceTemplateForm from '@/modules/admin/device-templates/device-template-form';
import SiteHeader from '@/modules/sidebar/site-header';

const CreateDevicePage = () => {
  return (
    <>
      <SiteHeader title="New Device Template" />
      <div className="container mx-auto flex flex-1 flex-col space-y-4 p-5 pt-20">
        <DeviceTemplateForm />
      </div>
    </>
  );
};

export default CreateDevicePage;
