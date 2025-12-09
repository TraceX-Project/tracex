import { Marker } from 'react-map-gl/mapbox';
import Link from 'next/link';
import { type Building } from '../buildings/_types/buildings';
import { IconEdit, IconMapPinFilled, IconMapSearch, IconTrash } from '@tabler/icons-react';
import { PATHS } from '@/shared/config/paths';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu';
import { useBoolean } from '@/shared/hooks/use-boolean';
import DeleteBuildingDialog from './delete-building-dialog';
import RenameBuildingDialog from './rename-building-dialog';

type Props = {
  building: Building;
};

const BuildingMarker = ({ building }: Props) => {
  const { value: isDeleteDialogOpen, setValue: setIsDeleteDialogOpen } = useBoolean(false);
  const { value: isRenameDialogOpen, setValue: setIsRenameDialogOpen } = useBoolean(false);

  return (
    <Marker longitude={building.location.lng} latitude={building.location.lat} anchor="bottom">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Link
            href={PATHS.projects.buildingView(building.projectId!, building.id)}
            prefetch={false}
          >
            <IconMapPinFilled className="h-7 w-7 cursor-pointer text-blue-500 transition-colors hover:text-blue-600" />
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsRenameDialogOpen(true)}>
            <IconEdit className="mr-1 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem>
            <IconMapSearch className="mr-1 h-4 w-4" />
            Change Location
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <IconTrash className="mr-1 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

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
    </Marker>
  );
};

export default BuildingMarker;
