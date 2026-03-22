'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAppForm } from '@/shared/tanstack-form/form';
import { type FormEvent, useCallback, useMemo } from 'react';
import { createDeviceSchema } from './_schema/schema';
import { useAddDevice } from './_hooks/use-add-device';
import { toast } from 'sonner';
import { useGetDeviceTemplates } from '../admin/device-templates/_hooks/use-get-device-templates';
import { DeviceType } from '../admin/device-templates/_types/device-template';
import { useUpdateThumbnail } from '../projects/_hooks/use-update-thumbnail';

type Props = {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateDeviceModal = ({ projectId, open, onOpenChange }: Props) => {
  const { data: deviceTemplates } = useGetDeviceTemplates({
    type: [DeviceType.ROUTER, DeviceType.SWITCH],
  });
  const { mutateAsync: addDevice } = useAddDevice();
  const { triggerUpdate: updateThumbnail } = useUpdateThumbnail();

  const transformedDeviceTemplates = useMemo(
    () =>
      deviceTemplates?.map((template) => ({
        label: template.modelName,
        value: template.id,
      })) ?? [],
    [deviceTemplates]
  );

  const form = useAppForm({
    defaultValues: {
      deviceTemplateId: '',
      files: [] as File[],
    },
    validators: {
      onSubmit: createDeviceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();

        formData.append('deviceTemplateId', value.deviceTemplateId);

        value.files.forEach((file) => {
          formData.append('files', file);
        });

        await addDevice({ projectId, formData });

        updateThumbnail({ projectId });

        onOpenChange(false);
        form.reset();
      } catch (error) {
        console.error(error);
        toast.error('Failed to add device. Please try again.');
      }
    },
  });

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) form.reset();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create Device</DialogTitle>
            <DialogDescription>
              Upload a configuration file to add a new device to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <form.AppField
              name="deviceTemplateId"
              children={(field) => (
                <field.SelectField
                  label="Device Template"
                  placeholder="Select a device template"
                  options={transformedDeviceTemplates}
                />
              )}
            />

            <form.AppField
              name="files"
              children={(field) => (
                <field.FileField
                  label="Configuration Files"
                  maxFiles={10}
                  accept={{
                    'text/plain': ['.txt'],
                  }}
                />
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <form.AppForm>
              <form.SubmitButton>Create</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeviceModal;
