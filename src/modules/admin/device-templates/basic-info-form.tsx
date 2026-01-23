import { type FormType } from '@/shared/tanstack-form/form';
import { DEVICE_TYPES_OPTIONS, DEVICE_VENDORS_OPTIONS } from './_constants/device-template';

type Props = {
  form: FormType;
};

const BasicInfoForm = ({ form }: Props) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Model Name */}
      <div className="col-span-8">
        <form.AppField
          name="modelName"
          children={(field) => (
            <field.TextField label="Model Name" placeholder="Enter model name" />
          )}
        />
      </div>

      {/* Unit Size */}
      <div className="col-span-4">
        <form.AppField
          name="unitSize"
          children={(field) => (
            <field.NumberField label="Unit Size" placeholder="Enter unit size" />
          )}
        />
      </div>

      {/* Vendor */}
      <div className="col-span-6">
        <form.AppField
          name="vendor"
          children={(field) => (
            <field.SelectField
              label="Vendor"
              options={DEVICE_VENDORS_OPTIONS}
              placeholder="Select a vendor"
            />
          )}
        />
      </div>

      {/* Type */}
      <div className="col-span-6">
        <form.AppField
          name="deviceType"
          children={(field) => (
            <field.SelectField
              label="Type"
              options={DEVICE_TYPES_OPTIONS}
              placeholder="Select a type"
            />
          )}
        />
      </div>

      {/* Front Panel */}
      <div className="col-span-12">
        <form.AppField
          name="frontPanel"
          children={(field) => <field.FileField label="Front Panel" />}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
