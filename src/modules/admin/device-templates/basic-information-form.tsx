import React from 'react';
import { DEVICE_VENDORS_OPTIONS, DEVICE_TYPES_OPTIONS } from './_constants/device-template';
import { useAppForm } from '@/shared/tanstack-form/form';

type Props = {
  form: ReturnType<typeof useAppForm>;
};

const BasicInformationForm = ({ form }: Props) => {
  return (
    <div className="space-y-6">
      {/* Vendor */}
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

      {/* Type */}
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

      {/* Model Name */}
      <form.AppField
        name="modelName"
        children={(field) => <field.TextField label="Model Name" placeholder="Enter model name" />}
      />

      {/* Unit Size */}
      <form.AppField
        name="unitSize"
        children={(field) => <field.NumberField label="Unit Size" placeholder="Enter unit size" />}
      />
    </div>
  );
};

export default BasicInformationForm;
