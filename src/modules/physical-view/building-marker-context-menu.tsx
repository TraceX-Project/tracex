import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu';
import { IconEdit, IconMapPinFilled, IconMapSearch, IconTrash, IconX } from "@tabler/icons-react"
import DeleteBuildingDialog from './delete-building-dialog';
import { type Building } from '../buildings/_types/buildings';
import { useBoolean } from '@/shared/hooks/use-boolean';
import RenameBuildingDialog from './rename-building-dialog';
import { usePhysicalMapStore } from './_store/physical-map.store';

type Props = {
  building: Building;
};

export const BuildingMarkerContextMenu = ({ building }: Props) => {
  const { value: isDeleteDialogOpen, setValue: setIsDeleteDialogOpen } = useBoolean(false);
  const { value: isRenameDialogOpen, setValue: setIsRenameDialogOpen } = useBoolean(false);
  const { setMovingBuildingId } = usePhysicalMapStore(state => state.actions);

  const handleDelete = () => {
    setTimeout(() => {
      setIsDeleteDialogOpen(true);
    }, 100);
  };

  const handleRename = () => {
    setTimeout(() => {
      setIsRenameDialogOpen(true);
    }, 100);
  };

  const handleMove = () => {
    setTimeout(() => {
      setMovingBuildingId(building.id);
    }, 100);
  };

  return (
    <>
      <DeleteBuildingDialog
        building={building}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />

      <RenameBuildingDialog
        building={building}
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
      />

      <ContextMenu>
        <ContextMenuTrigger>
          <IconMapPinFilled className='text-orange-600 w-8 h-8 hover:scale-105 hover:text-orange-700' />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleRename}>
            <IconEdit className="size-4" />
            Rename
          </ContextMenuItem>

          <ContextMenuItem onClick={handleMove}>
            <IconMapSearch className="size-4" />
            Change Location
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem variant="destructive" onClick={handleDelete}>
            <IconTrash className="size-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
