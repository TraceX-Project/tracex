import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu';
import { IconEdit, IconMapPinFilled, IconMapSearch, IconTrash } from '@tabler/icons-react';
import { type Building } from '../buildings/_types/buildings';
import { useBoolean } from '@/shared/hooks/use-boolean';
import RenameBuildingDialog from './rename-building-dialog';
import { usePhysicalMapStore } from './_store/physical-map.store';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { useCallback } from 'react';
import { useDeleteBuilding } from '../buildings/_hooks/use-delete-building';
import { toast } from 'sonner';

type Props = {
  building: Building;
};

export const BuildingMarkerContextMenu = ({ building }: Props) => {
  const { value: isDeleteDialogOpen, setValue: setIsDeleteDialogOpen } = useBoolean(false);
  const { value: isRenameDialogOpen, setValue: setIsRenameDialogOpen } = useBoolean(false);
  const { setMovingBuildingId } = usePhysicalMapStore((state) => state.actions);
  const { mutateAsync: deleteBuilding } = useDeleteBuilding();


  const handleOpenDeleteDialog = () => {
    setTimeout(() => {
      setIsDeleteDialogOpen(true);
    }, 100);
  };

  const handleOpenRenameDialog = () => {
    setTimeout(() => {
      setIsRenameDialogOpen(true);
    }, 100);
  };

  const handleMove = () => {
    setTimeout(() => {
      setMovingBuildingId(building.id);
    }, 100);
  };

  const handleDeleteBuilding = useCallback(async () => {
    try {
      await deleteBuilding(building.id);
      setIsDeleteDialogOpen(false);

      toast.success('Building deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete building');
    }
  }, [building.id, deleteBuilding]);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <IconMapPinFilled className="h-8 w-8 text-orange-600 hover:scale-105 hover:text-orange-700" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleOpenRenameDialog}>
            <IconEdit className="size-4" />
            Rename
          </ContextMenuItem>

          <ContextMenuItem onClick={handleMove}>
            <IconMapSearch className="size-4" />
            Change Location
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem variant="destructive" onClick={handleOpenDeleteDialog}>
            <IconTrash className="size-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Are you sure?"
        description={`This action cannot be undone. This will permanently delete the building "${building.name}" and remove all associated data.`}
        onConfirm={handleDeleteBuilding}
      />

      <RenameBuildingDialog
        building={building}
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
      />
    </>
  );
};
