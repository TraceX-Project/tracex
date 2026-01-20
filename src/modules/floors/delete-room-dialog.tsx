import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { type Room } from '../rooms/_types/room';
import { useCallback } from 'react';
import { useDeleteRoom } from './_hooks/use-delete-room';
import { toast } from 'sonner';

type Props = {
  room: Room
  isOpen: boolean;
  onClose: () => void;
}

const DeleteRoomDialog = ({ room, isOpen, onClose }: Props) => {
  const { mutateAsync: deleteRoom } = useDeleteRoom()

  const handleDelete = useCallback(async () => {
    try {
      await deleteRoom(room.id)
      onClose()

      toast.success('Room deleted successfully');
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete room');
    }
  }, [room, onClose]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the room &quot;
            {room.name}
            &quot; and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteRoomDialog