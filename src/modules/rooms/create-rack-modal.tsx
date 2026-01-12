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
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { useCreateRack } from './_hooks/use-create-rack';
import { VariantProps } from 'class-variance-authority';
import { useBoolean } from '@/shared/hooks/use-boolean';

type Props = {
  roomId: string;
  title: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
  icon?: React.ReactNode;
};

const CreateRackModal = ({ roomId, title, variant = 'default', size = 'default', icon }: Props) => {
  // const { setIsCreateRoomModalOpen, setClickedPosition } = useRoomStore((state) => state.actions);
  // const isCreateRoomModalOpen = useRoomStore((state) => state.isCreateRoomModalOpen);
  // const clickedPosition = useRoomStore((state) => state.clickedPosition);
  const { mutateAsync: createRack } = useCreateRack();
  const { value: open, setValue: setOpen } = useBoolean();

  const form = useAppForm({
    defaultValues: {
      name: '',
      unitSize: 0,
    },
    validators: {
      onSubmit: createRackSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createRack({
          roomId: roomId,
          data: {
            name: value.name,
            unitSize: value.unitSize,
          },
        });

        // setIsCreateRoomModalOpen(false);
        // setClickedPosition(null);
        form.reset();
        setOpen(false);

        toast.success('Rack created successfully.');
      } catch {
        toast.error('Failed to create rack. Please try again.');
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          {icon}
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>New Rack</DialogTitle>
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
              <form.SubmitButton>Create</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRackModal;
