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
import { type Building } from '../buildings/_types/buildings';
import { useDeleteBuilding } from '../buildings/_hooks/use-delete-building';
import { useCallback } from 'react';
import { useBuildingDragStore } from './_store/building-drag.store';

type Props = {
  building: Building;
  isOpen: boolean;
  onClose: () => void;
};

const DeleteBuildingDialog = ({ building, isOpen, onClose }: Props) => {
  const { mutateAsync: deleteBuilding } = useDeleteBuilding();

  const handleDelete = useCallback(async () => {
    await deleteBuilding(building.id);
  }, [building, deleteBuilding]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the building &quot;
            {building.name}
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
  );
};

export default DeleteBuildingDialog;
