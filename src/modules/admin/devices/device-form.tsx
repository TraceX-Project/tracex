'use client';

import { useAppForm } from '@/shared/tanstack-form/form';
import React, { useCallback } from 'react';
import {
  DEVICE_BRANDS_OPTIONS,
  DEVICE_TYPES_OPTIONS,
  DeviceBrand,
  DeviceType,
} from './_constants/device';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { projectSchema } from './_schema/schema';

const DeviceForm = () => {
  const form = useAppForm({
    defaultValues: {
      modelName: '',
      brand: DeviceBrand.CISCO,
      type: DeviceType.ROUTER,
      unitSize: 1,
    },
    validators: {
      onChange: projectSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted with values:', value);
    },
  });

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Card className="max-w-3xl w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">Create New Device</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Model Name */}
          <div>
            <form.AppField
              name="modelName"
              children={(field) => (
                <field.TextField label="Model Name" placeholder="Enter model name" />
              )}
            />
          </div>

          {/* Group: Unit Size, Brand, Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Unit Size */}
            <div>
              <form.AppField
                name="unitSize"
                children={(field) => (
                  <field.NumberField label="Unit Size" placeholder="Enter unit size" />
                )}
              />
            </div>

            {/* Brand */}
            <div>
              <form.AppField
                name="brand"
                children={(field) => (
                  <field.SelectField
                    label="Brand"
                    options={DEVICE_BRANDS_OPTIONS}
                    placeholder="Select a brand"
                  />
                )}
              />
            </div>

            {/* Type */}
            <div>
              <form.AppField
                name="type"
                children={(field) => (
                  <field.SelectField
                    label="Type"
                    options={DEVICE_TYPES_OPTIONS}
                    placeholder="Select a type"
                  />
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-start">
            <form.AppForm>
              <form.SubmitBtn label="Create" />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeviceForm;
