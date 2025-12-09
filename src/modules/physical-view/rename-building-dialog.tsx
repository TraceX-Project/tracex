import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import React, { type FormEvent, useCallback } from 'react';
import { type Building } from '../buildings/_types/buildings';
import { useAppForm } from '@/shared/tanstack-form/form';
import { updateBuildingSchema } from '../buildings/_schema/building';
import { useUpdateBuilding } from '../buildings/_hooks/use-update-building';
import { toast } from 'sonner';

type Props = {
  building: Building;
  isOpen: boolean;
  onClose: () => void;
};

const RenameBuildingDialog = ({ building, isOpen, onClose }: Props) => {
  const { mutateAsync: updateBuilding } = useUpdateBuilding();

  const form = useAppForm({
    defaultValues: {
      name: building.name,
    },
    validators: {
      onSubmit: updateBuildingSchema.pick({ name: true }).required(),
    },
    onSubmit: async ({ value }) => {
      try {
        await updateBuilding({
          id: building.id,
          payload: {
            name: value.name,
          },
        });

        onClose();

        toast.success('Building name updated successfully!');
      } catch (error) {
        console.error('Failed to update building name:', error);

        toast.error(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while updating the building name.'
        );
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Rename Building</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Building Name" placeholder="Enter building name" />
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </DialogClose>

            <form.AppForm>
              <form.SubmitButton>Rename</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameBuildingDialog;
