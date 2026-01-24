'use client';

import React, { type FormEvent, useCallback, useEffect } from 'react';
import { Button, type buttonVariants } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAppForm } from '@/shared/tanstack-form/form';

import { toast } from 'sonner';
import { useUpdateFloor } from '../floors/_hooks/use-floor';
import { updateFloorSchema } from '../floors/_schema/floor';
import { Floor } from '../floors/_types/floor';

type Props = {
  floor: Floor
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EditFloorModal = ({ floor, open, onOpenChange }: Props) => {
  const { mutateAsync: updateFloor } = useUpdateFloor();

  const form = useAppForm({
    defaultValues: {
      name: floor.name,
      floorPlan: null as File | null,
    },
    validators: {
      onSubmit: updateFloorSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();

        formData.append('name', value.name);

        if (value.floorPlan) {
          formData.append('file', value.floorPlan);
        }

        await updateFloor({
          floorId: floor.id,
          data: formData,
        });

        form.reset();
        onOpenChange(false);

        toast.success('Floor updated successfully');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to update floor. Please try again.'
        );
      }
    },
  });

  useEffect(() => {
    if (open) {
      form.setFieldValue('name', floor.name);
      form.setFieldValue('floorPlan', null);
    }
  }, [floor, open, form]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Floor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Name */}
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Name" placeholder="Enter floor name" />}
            />

            {/* Floor Plan */}
            <form.AppField
              name="floorPlan"
              children={(field) => <field.FileField label="Floor Plan (Optional)" multiple={false} />}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </DialogClose>

            <form.AppForm>
              <form.SubmitButton>Save Changes</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFloorModal;
