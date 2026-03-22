import React from 'react';
import { HYPERVISOR_VENDORS_OPTIONS } from './_constants/logical-view';
import { type FormType } from '@/shared/tanstack-form/form';

type Props = {
  form: FormType;
};

const CredentialsStep = ({ form }: Props) => {
  return (
    <div className="grid gap-4">
      <form.AppField
        name="vendor"
        children={(field) => (
          <field.SelectField
            label="Vendor"
            options={HYPERVISOR_VENDORS_OPTIONS}
            placeholder="Select a vendor"
          />
        )}
      />

      <form.AppField
        name="apiUrl"
        children={(field) => (
          <field.TextField label="API URL" placeholder="Enter API URL" type="url" />
        )}
      />

      <form.AppField
        name="apiKey"
        children={(field) => (
          <field.TextField label="API Key" placeholder="Enter API Key" type="password" />
        )}
      />
    </div>
  );
};

export default CredentialsStep;
