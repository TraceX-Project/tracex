'use client';

import React, { type FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppForm } from '@/shared/tanstack-form/form';
import { addDeviceSchema } from '../rooms/_schema/schema';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { useAddDevicesToRack } from './_hooks/use-add-devices-to-rack';
import { type GetRacksResponse, type DEVICE_OPTIONS } from './_types/room';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { useGetPhysicalDevices } from './_hooks/use-get-physical-devices';
import EditRackDialog from './edit-rack-dialog';

type Props = {
  rack: GetRacksResponse;
};

const AddDevicesModal = ({ rack }: Props) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { mutateAsync: addDevicesToRack } = useAddDevicesToRack();
  const { data: devices, isLoading } = useGetPhysicalDevices(projectId, { inRack: false });
  const [deviceOptions, setDeviceOptions] = useState<DEVICE_OPTIONS[]>([]);
  const [addDevicesOpen, setAddDevicesOpen] = useState(false);
  const [editRackOpen, setEditRackOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      deviceIds: [] as string[],
    },
    validators: {
      onSubmit: addDeviceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await addDevicesToRack({
          rackId: rack.id,
          roomId: rack.roomId,
          data: {
            deviceIds: value.deviceIds,
          },
        });
        form.reset();
        setAddDevicesOpen(false);
        toast.success('Devices added successfully.');
      } catch {
        toast.error('Failed to add devices. Please try again.');
      }
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };

  useEffect(() => {
    if (devices) {
      console.log(devices);
      const options = devices.map((device) => ({
        value: device.id,
        label: device.name,
      }));
      setDeviceOptions(options);
    }
  }, [devices]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setTimeout(() => {
                  setAddDevicesOpen(true);
                }, 100);
              }}
            >
              Add Devices
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setTimeout(() => {
                  setEditRackOpen(true);
                }, 100)
              }
            >
              Edit Rack
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
              Delete Rack
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={addDevicesOpen} onOpenChange={setAddDevicesOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Devices to Rack</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <form.AppField
                name="deviceIds"
                children={(field) => (
                  <field.MultipleSelectField
                    overflowBehavior="cutoff"
                    label="Select Devices"
                    options={deviceOptions}
                    placeholder={isLoading ? 'Loading devices...' : 'Select devices'}
                  />
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </DialogClose>

              <form.AppForm>
                <form.SubmitButton>Add Devices</form.SubmitButton>
              </form.AppForm>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <EditRackDialog rack={rack} open={editRackOpen} onOpenChange={setEditRackOpen} />
    </>
  );
};

export default AddDevicesModal;
