'use client';

import { useAppForm } from '@/shared/tanstack-form/form';
import React, { useCallback } from 'react';
import { DEVICE_BRANDS_OPTIONS, DEVICE_TYPES_OPTIONS } from './_constants/device-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { deviceTemplateSchema } from './_schema/schema';
import { useCreateDeviceTemplate } from './_hooks/use-create-device-template';
import { toast } from 'sonner';
import { DeviceBrand, DeviceType } from './_types/device-template';
import { useUploadFile } from '@/shared/hooks/use-upload-file';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';

const DeviceTemplateForm = () => {
  const { mutateAsync: createNewDeviceTemplate } = useCreateDeviceTemplate();
  const { onUpload: onUploadFront } = useUploadFile();
  const { onUpload: onUploadBack } = useUploadFile();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      modelName: '',
      brand: DeviceBrand.CISCO,
      type: DeviceType.ROUTER,
      frontPanelId: '',
      backPanelId: '',
      unitSize: 1,
    },
    validators: {
      onChange: deviceTemplateSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createNewDeviceTemplate({
          modelName: value.modelName,
          brand: value.brand,
          type: value.type,
          frontPanelId: value.frontPanelId,
          backPanelId: value.backPanelId,
          unitSize: value.unitSize,
        });

        toast.success('Device template created successfully');
        router.push(PATHS.admin.deviceTemplates.root);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while creating the device template.'
        );
      }
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
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">Create New Device Template</CardTitle>
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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

          {/* Front Panel Upload */}
          <form.AppField
            name="frontPanelId"
            children={(field) => (
              <field.FileUploader label="Front Panel" maxFiles={1} onUpload={onUploadFront} />
            )}
          />

          {/* Back Panel Upload */}
          <form.AppField
            name="backPanelId"
            children={(field) => (
              <field.FileUploader label="Back Panel" maxFiles={1} onUpload={onUploadBack} />
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-start">
            <form.AppForm>
              <form.SubmitButton>Create</form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeviceTemplateForm;
