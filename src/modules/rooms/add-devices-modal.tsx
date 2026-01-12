'use client';

import React, { FormEvent, useEffect, useState } from 'react';
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
import { useAddDevices } from './_hooks/use-add-devices';
import { DEVICE_OPTIONS } from './_types/room';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectLabel } from '@/shared/components/ui/select';
import { SelectItemText } from '@radix-ui/react-select';
import { useGetDevices } from './_hooks/use-get-devices';

type Props = {
  rackId: string;
};

const AddDevicesModal = ({ rackId }: Props) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { mutateAsync: addDevices } = useAddDevices();
  const { data: devices } = useGetDevices(projectId);
  const [addDevicesOpen, setAddDevicesOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      devices: [] as string[],
    },
    validators: {
      onSubmit: addDeviceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await addDevices({
          rackId: rackId,
          data: {
            devices: value.devices,
          },
        });

        form.reset();
        setAddDevicesOpen(false); // Close modal on success
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
    console.log('devices', devices);
  }, []);

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
            <DropdownMenuItem onClick={() => setAddDevicesOpen(true)}>Add Devices</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Rack</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
              Delete Rack
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={addDevicesOpen} onOpenChange={setAddDevicesOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Devices to Rack</DialogTitle>
            </DialogHeader>
            {}
            {/*<div className="grid gap-4">
              <form.AppField
                name="devices" // Binds to a STRING
                children={(field) => (
                )
            </div>*/}

            {form.getFieldValue('devices').length > 0 && (
              <Select>
                <SelectLabel>Devices to be added:</SelectLabel>
                <SelectContent>
                  {form.getFieldValue('devices').map((deviceId: string) => {
                    const device = DEVICE_OPTIONS.find((d) => d.value === deviceId);
                    if (!device) return null;
                    return (
                      <SelectItem key={deviceId} value={deviceId}>
                        <SelectItemText>{device.label}</SelectItemText>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}

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
    </>
  );
};

export default AddDevicesModal;
