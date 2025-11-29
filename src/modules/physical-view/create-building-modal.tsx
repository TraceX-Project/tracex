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
import { FormEvent, useCallback } from 'react';
import { usePhysicalMapStore } from './_store/physical-map.store';
import { toast } from 'sonner';
import { useCreateBuilding } from '../buildings/_hooks/use-create-building';
import { createBuildingSchema } from '../buildings/_schema/schema';

type Props = {
  projectId: string;
};

const CreateBuildingModal = ({ projectId }: Props) => {
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
        const payload = {
          ...value,
          location: selectedLocation!.location,
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

export default CreateBuildingModal;
