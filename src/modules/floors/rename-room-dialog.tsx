import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAppForm } from '@/shared/tanstack-form/form';
import { Room } from '../rooms/_types/room';
import { createFloorSchema } from './_schema/floor';
import { FormEvent, useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';

type Props = {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

const RenameRoomDialog = ({ room, isOpen, onClose }: Props) => {
  const form = useAppForm({
    defaultValues: {
      name: room.name
    },
    validators: {
      onSubmit: createFloorSchema.pick({ name: true }).required(),
    },
    onSubmit: async ({ value }) => {
      console.log('Rename room', value)
    }
  })

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
  )
}

export default RenameRoomDialog