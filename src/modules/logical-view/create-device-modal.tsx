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
import { useAddDevice } from './_hooks/use-add-device';
import { toast } from 'sonner';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { useGetDeviceTemplates } from '../admin/device-templates/_hooks/use-get-device-templates';
import { DeviceType } from '../admin/device-templates/_types/device-template';
import { useUpdateThumbnail } from '../projects/_hooks/use-update-thumbnail';
import { useUpdateDevicePositions } from './_hooks/use-update-device-positions';
import { getLayoutedPositions } from './_utils/position';
import { useGetTopology } from './_hooks/use-get-topology';

type Props = {
  projectId: string;
};

const CreateDeviceModal = ({ projectId }: Props) => {
  const { data: deviceTemplates } = useGetDeviceTemplates({
    type: [DeviceType.ROUTER, DeviceType.SWITCH],
  });
  const { mutateAsync: addDevice } = useAddDevice();
  const { triggerUpdate: updateThumbnail } = useUpdateThumbnail();
  const { mutateAsync: updateDevicePositions } = useUpdateDevicePositions();
  const { value: open, setValue: setOpen } = useBoolean();
  const { data: topology } = useGetTopology(projectId);

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

        const newDevices = await addDevice({ projectId, formData });
        const existingNodes = topology?.nodes ?? [];
        const edges = topology?.edges ?? [];

        if (newDevices && Array.isArray(newDevices)) {
          const newNodes = newDevices.map((device) => ({
            id: device.id,
            name: device.name,
            type: device.type as DeviceType,
            position: { x: 0, y: 0 },
            inRack: false,
          }));

          const allNodes = [...existingNodes, ...newNodes];
          const layoutedPositions = getLayoutedPositions(allNodes, edges);

          const positionsToUpdate = newDevices.map((device) => ({
            id: device.id,
            x: layoutedPositions.get(device.id)?.x ?? 0,
            y: layoutedPositions.get(device.id)?.y ?? 0,
          }));

          if (positionsToUpdate.length > 0) {
            await updateDevicePositions({ positions: positionsToUpdate });
          }
        }

        updateThumbnail({ projectId });

        setOpen(false);
        form.reset();
      } catch (error) {
        console.error(error);
        toast.error('Failed to add device. Please try again.');
      }
    },
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        form.reset();
      }
    },
    [form, setOpen]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
