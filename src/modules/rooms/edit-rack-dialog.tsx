'use client';
import { useAppForm } from '@/shared/tanstack-form/form';
import React, { type FormEvent, useCallback } from 'react';
import { createRackSchema } from '../rooms/_schema/schema';
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
import { useUpdateRack } from './_hooks/use-update-rack';
import { type Rack } from './_types/room';

type Props = {
  rack: Rack;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const UpdateRackDialog = ({ rack, open, onOpenChange }: Props) => {
  const { mutateAsync: updateRack } = useUpdateRack();

  const form = useAppForm({
    defaultValues: {
      name: rack.name,
      unitSize: rack.unitSize,
    },
    validators: {
      onSubmit: createRackSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateRack({
          rackId: rack.id,
          roomId: rack.roomId,
          body: {
            name: value.name,
            unitSize: value.unitSize,
          },
        });

        form.reset();
        onOpenChange(false);
        toast.success('Rack updated successfully.');
      } catch {
        toast.error('Failed to update rack. Please try again.');
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Rack</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Name */}
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Rack Name" placeholder="Enter rack name" />
              )}
            />

            {/* Floor Plan */}
            <form.AppField
              name="unitSize"
              children={(field) => <field.NumberField label="Unit Size" />}
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

export default UpdateRackDialog;
