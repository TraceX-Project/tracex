import * as React from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAppForm } from '@/shared/tanstack-form/form';
import { type FormEvent, useCallback, useEffect } from 'react';
import { usePhysicalMapStore } from './_store/physical-map.store';
import { toast } from 'sonner';
import { useCreateBuilding } from '../buildings/_hooks/use-create-building';
import { createBuildingSchema } from '../buildings/_schema/building';

type Props = {
  projectId: string;
};

const CreateBuildingDialog = ({ projectId }: Props) => {
  const isOpen = usePhysicalMapStore((state) => state.isCreateBuildingModalOpen);
  const selectedLocation = usePhysicalMapStore((state) => state.selectedLocation);
  const { setIsCreateBuildingModalOpen, reset } = usePhysicalMapStore((state) => state.actions);
  const { mutateAsync: createBuilding } = useCreateBuilding();

  const form = useAppForm({
    defaultValues: {
      name: selectedLocation?.name ?? '',
      location: {
        lat: 0,
        lng: 0,
      },
    },
    validators: {
      onSubmit: createBuildingSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('create building', value);
        console.log('selectedLocation', selectedLocation);

        const payload = {
          ...value,
          location: {
            lat: selectedLocation!.location.lat,
            lng: selectedLocation!.location.lng,
          },
        };

        await createBuilding({ projectId, payload });

        setIsCreateBuildingModalOpen(false);
        reset();

        toast.success('Building created successfully');
      } catch (error) {
        toast.error('Error creating building');
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

  useEffect(() => {
    if (isOpen && selectedLocation) {
      form.reset({
        name: selectedLocation.name ?? '',
        location: selectedLocation.location,
      });
    }
  }, [isOpen, selectedLocation, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsCreateBuildingModalOpen(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>New Building</DialogTitle>
          </DialogHeader>
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Name" placeholder="Enter building name" />}
          />
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

export default CreateBuildingDialog;
