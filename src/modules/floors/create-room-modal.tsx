import { useAppForm } from '@/shared/tanstack-form/form';
import React, { type FormEvent, useCallback } from 'react';
import { createRoomSchema } from '../rooms/_schema/schema';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useCreateRoom } from './_hooks/use-create-room';
import { useRoomStore } from './_store/room.store';
import { toast } from 'sonner';

type Props = {
  floorId: string;
};

const CreateRoomModal = ({ floorId }: Props) => {
  const { setIsCreateRoomModalOpen, setClickedPosition } = useRoomStore((state) => state.actions);
  const isCreateRoomModalOpen = useRoomStore((state) => state.isCreateRoomModalOpen);
  const clickedPosition = useRoomStore((state) => state.clickedPosition);
  const { mutateAsync: createRoom } = useCreateRoom();

  const form = useAppForm({
    defaultValues: {
      name: '',
      x: 0,
      y: 0,
    },
    validators: {
      onSubmit: createRoomSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createRoom({
          floorId,
          body: {
            name: value.name,
            x: clickedPosition!.x,
            y: clickedPosition!.y,
          },
        });

        setIsCreateRoomModalOpen(false);
        setClickedPosition(null);
        form.reset();

        toast.success('Room created successfully.');
      } catch {
        toast.error('Failed to create room. Please try again.');
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
    <Dialog open={isCreateRoomModalOpen} onOpenChange={setIsCreateRoomModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>New Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Name */}
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Name" placeholder="Enter floor name" />}
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

export default CreateRoomModal;
