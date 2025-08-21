'use client';

import { useAppForm } from '@/shared/tanstack-form/form';
import React, { useCallback, useState } from 'react';
import {
  DEVICE_BRANDS_OPTIONS,
  DEVICE_TYPES_OPTIONS,
  DeviceBrand,
  DeviceType,
} from './_constants/device';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { projectSchema } from './_schema/schema';
import { useCreateDeviceTemplate } from './_hooks/use-create-deviceTemplate';
import { useUploadAttachment } from './_hooks/use-upload-attachment';
import { useDeleteAttachment } from './_hooks/use-delete-attachment';
import { toast } from 'sonner';

const DeviceForm = () => {
  const { mutateAsync: createNewDeviceTemplate } = useCreateDeviceTemplate();
  const { mutateAsync: uploadAttachment, isPending: isUploading } = useUploadAttachment();
  const { mutateAsync: deleteAttachment } = useDeleteAttachment();

  // State to store uploaded URLs and IDs
  const [frontPanelURL, setFrontPanelURL] = useState<string>('');
  const [backPanelURL, setBackPanelURL] = useState<string>('');
  const [frontPanelId, setFrontPanelId] = useState<string>('');
  const [backPanelId, setBackPanelId] = useState<string>('');

  // Handle file upload with deletion of old image
  const handleFileUpload = async (file: File, type: 'front' | 'back') => {
    try {
      // Delete old image if it exists
      const oldId = type === 'front' ? frontPanelId : backPanelId;
      if (oldId) {
        try {
          await deleteAttachment(oldId);
          toast.success(`Old ${type === 'front' ? 'front' : 'back'} panel image deleted`);
        } catch (error) {
          console.error(`Failed to delete old ${type} panel image:`, error);
          // Continue with upload even if delete fails
        }
      }

      // Upload new image
      const result = await uploadAttachment(file);
      console.log(result);
      const { url } = result;
      console.log('URL:', url);

      if (type === 'front') {
        setFrontPanelURL(url);
        // setFrontPanelId(id);
        form.setFieldValue('frontPanel', url);
      } else {
        setBackPanelURL(url);
        // setBackPanelId(id);
        form.setFieldValue('backPanel', url);
      }

      toast.success(`${type === 'front' ? 'Front' : 'Back'} panel image uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${type === 'front' ? 'front' : 'back'} panel image`);
    }
  };

  // Cleanup function to delete uploaded images on component unmount if not submitted
  React.useEffect(() => {
    return () => {
      // Only cleanup if there are uploaded images and form wasn't successfully submitted
      const cleanupImages = async () => {
        if (frontPanelId) {
          try {
            await deleteAttachment(frontPanelId);
          } catch (error) {
            console.error('Failed to cleanup front panel image:', error);
          }
        }
        if (backPanelId) {
          try {
            await deleteAttachment(backPanelId);
          } catch (error) {
            console.error('Failed to cleanup back panel image:', error);
          }
        }
      };

      // Only cleanup if we have images but form hasn't been successfully submitted
      if ((frontPanelId || backPanelId) && (frontPanelURL || backPanelURL)) {
        cleanupImages();
      }
    };
  }, [frontPanelId, backPanelId, frontPanelURL, backPanelURL, deleteAttachment]);

  const form = useAppForm({
    defaultValues: {
      modelName: '',
      brand: DeviceBrand.CISCO,
      type: DeviceType.ROUTER,
      frontPanel: '',
      backPanel: '',
      unitSize: 1,
    },
    validators: {
      onChange: projectSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('frontPanel', value.frontPanel);
      console.log('backPanel', value.backPanel);

      if (!frontPanelURL || !backPanelURL) {
        toast.error('Please upload both front and back panel images');
        return;
      }

      try {
        const createdDeviceTemplate = await createNewDeviceTemplate({
          modelName: value.modelName,
          brand: value.brand,
          type: value.type,
          FrontPanelURL: frontPanelURL,
          BackPanelURL: backPanelURL,
          size: value.unitSize,
        });

        // Reset form and URLs
        form.reset();
        setFrontPanelURL('');
        setBackPanelURL('');
        // setFrontPanelId('');
        // setBackPanelId('');

        toast.success('Device template created successfully');
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
          <form.AppField
            name="frontPanel"
            children={(field) => (
              <field.FileField
                label="Front Panel"
                disabled={isUploading}
                onFileSelect={(files) => {
                  if (files && files.length > 0) {
                    handleFileUpload(files[0], 'front');
                  }
                }}
              />
            )}
          />
          {frontPanelURL && (
            <div className="mt-2">
              <p className="text-sm text-green-600">✓ Front panel uploaded successfully</p>
            </div>
          )}

          <form.AppField
            name="backPanel"
            children={(field) => (
              <field.FileField
                label="Back Panel"
                disabled={isUploading}
                onFileSelect={(files) => {
                  if (files && files.length > 0) {
                    handleFileUpload(files[0], 'back');
                  }
                }}
              />
            )}
          />
          {backPanelURL && (
            <div className="mt-2">
              <p className="text-sm text-green-600">✓ Back panel uploaded successfully</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-start">
            <form.AppForm>
              <form.SubmitBtn label={'Create'} />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeviceForm;
