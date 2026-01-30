'use client';

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
import React, { type FormEvent, useCallback, useMemo } from 'react';
import { moveDeviceToRackSchema } from './_schema/schema';
import { useGetBuildings } from '../buildings/_hooks/use-get-buildings';
import { useParams } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { useStore } from '@tanstack/react-form';
import { useGetFloors } from '../floors/_hooks/use-floor';
import { useGetRooms } from '../floors/_hooks/use-get-rooms';
import { useGetRacks } from './_hooks/use-get-racks';
import { toSelectOptions } from '@/shared/utils/form';
import { useAddDevicesToRack } from './_hooks/use-add-devices-to-rack';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
};

const MoveToRackModal = ({ open, onOpenChange, deviceId }: Props) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { mutateAsync: addDevicesToRack } = useAddDevicesToRack();

  const form = useAppForm({
    defaultValues: {
      buildingId: '',
      roomId: '',
      floorId: '',
      rackId: '',
    },
    validators: {
      onSubmit: moveDeviceToRackSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('Submitting move to rack with values:', value);

        await addDevicesToRack({
          rackId: value.rackId,
          roomId: value.roomId,
          data: {
            devices: [{ deviceId }],
          },
        });

        toast.success('Device moved to rack successfully');
      } catch (error) {
        toast.error('Failed to move device to rack');
      }
    },
  });

  const buildingId = useStore(form.store, (state) => state.values.buildingId);
  const floorId = useStore(form.store, (state) => state.values.floorId);
  const roomId = useStore(form.store, (state) => state.values.roomId);

  const { data: buildings } = useGetBuildings(projectId);
  const { data: floors } = useGetFloors(buildingId);
  const { data: rooms } = useGetRooms(floorId);
  const { data: racks } = useGetRacks(roomId);

  const buildingOptions = useMemo(
    () => toSelectOptions(buildings ?? [], 'name', 'id'),
    [buildings]
  );

  const floorOptions = useMemo(() => toSelectOptions(floors ?? [], 'name', 'id'), [floors]);

  const roomOptions = useMemo(() => toSelectOptions(rooms ?? [], 'name', 'id'), [rooms]);

  const rackOptions = useMemo(() => toSelectOptions(racks ?? [], 'name', 'id'), [racks]);

  const handleSelectBuilding = useCallback(
    (value: string) => {
      form.setFieldValue('floorId', '');
      form.setFieldValue('roomId', '');
      form.setFieldValue('rackId', '');
    },
    [form]
  );

  const handleSelectFloor = useCallback(
    (value: string) => {
      form.setFieldValue('roomId', '');
      form.setFieldValue('rackId', '');
    },
    [form]
  );

  const handleSelectRoom = useCallback(
    (value: string) => {
      form.setFieldValue('rackId', '');
    },
    [form]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Move Device to New Rack</DialogTitle>
            <DialogDescription>
              Select the building, floor, room, and rack where you want to move the device.
            </DialogDescription>
          </DialogHeader>
          <form.AppField
            name="buildingId"
            children={(field) => (
              <field.SelectField
                label="Building"
                options={buildingOptions}
                placeholder="Select building"
                onValueChange={handleSelectBuilding}
              />
            )}
          />

          <form.AppField
            name="floorId"
            children={(field) => (
              <field.SelectField
                label="Floor"
                options={floorOptions}
                placeholder="Select floor"
                onValueChange={handleSelectFloor}
                disabled={!buildingId}
              />
            )}
          />

          <form.AppField
            name="roomId"
            children={(field) => (
              <field.SelectField
                label="Room"
                options={roomOptions}
                placeholder="Select room"
                onValueChange={handleSelectRoom}
                disabled={!floorId}
              />
            )}
          />

          <form.AppField
            name="rackId"
            children={(field) => (
              <field.SelectField
                label="Rack"
                options={rackOptions}
                placeholder="Select rack"
                disabled={!roomId}
              />
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </DialogClose>

            <form.AppForm>
              <form.SubmitButton>Change Location</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MoveToRackModal;
