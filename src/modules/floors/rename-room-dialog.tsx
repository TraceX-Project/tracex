import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAppForm } from '@/shared/tanstack-form/form';
import { type Room } from '../rooms/_types/room';
import { createFloorSchema } from './_schema/floor';
import { type FormEvent, useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import { useUpdateRoom } from './_hooks/use-update-room';
import { toast } from 'sonner';

type Props = {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
};

const RenameRoomDialog = ({ room, isOpen, onClose }: Props) => {
  const { mutateAsync: updateRoom } = useUpdateRoom();

  const form = useAppForm({
    defaultValues: {
      name: room.name,
    },
    validators: {
      onSubmit: createFloorSchema.pick({ name: true }).required(),
    },
    onSubmit: async ({ value }) => {
      try {
        await updateRoom({
          roomId: room.id,
          payload: {
            name: value.name,
          },
          floorId: room.floorId,
        });
        onClose();

        toast.success('Room renamed successfully');
      } catch (error) {
        console.log(error);
        toast.error('Failed to rename room');
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
            <DialogTitle>Rename Room</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Room Name" placeholder="Enter room name" />
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

export default RenameRoomDialog;
