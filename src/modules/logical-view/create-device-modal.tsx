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
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useAppForm } from '@/shared/tanstack-form/form';
import { Plus } from 'lucide-react';
import { type FormEvent, useCallback, useMemo } from 'react';
import { createDeviceSchema } from './_schema/schema';
import { useGetDeviceTemplates } from '../admin/device-templates/_hooks/use-get-device-templates';

const CreateDeviceModal = () => {
  const { data: deviceTemplates } = useGetDeviceTemplates();

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
      console.log(value);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus />
          Add device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create Device</DialogTitle>
            <DialogDescription>
              Upload a configuration file to add a new device to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Device Template */}
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

            {/* Configuration Files */}
            <form.AppField
              name="files"
              children={(field) => <field.FileField label="Configuration Files" maxFiles={10} />}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </DialogClose>

            <form.AppForm>
              <form.SubmitButton>Create</form.SubmitButton>
            </form.AppForm>
            {/* <Button type="submit">Save changes</Button> */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeviceModal;
