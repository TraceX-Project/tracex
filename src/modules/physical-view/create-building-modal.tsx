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
import { createBuildingSchema } from './_schema.ts/schema';
import { FormEvent, useCallback } from 'react';
import { usePhysicalMapStore } from './_store/physical-map.store';

const CreateBuildingDialog = () => {
  const isOpen = usePhysicalMapStore((state) => state.isCreateBuildingModalOpen);
  const selectedLocation = usePhysicalMapStore((state) => state.selectedLocation);
  const { setIsCreateBuildingModalOpen } = usePhysicalMapStore((state) => state.actions);

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
        const createdBuilding = {
          ...value,
          location: selectedLocation?.location,
        };
        console.log('create buildings value', createdBuilding);
      } catch (error) {
        console.error('Error creating building:', error);
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
