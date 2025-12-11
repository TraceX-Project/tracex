import { Marker, type MarkerDragEvent } from 'react-map-gl/mapbox';
import Link from 'next/link';
import { type Building } from '../buildings/_types/buildings';
import { IconEdit, IconMapPinFilled, IconMapSearch, IconTrash, IconX } from '@tabler/icons-react';
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
import { useCallback, useEffect } from 'react';
import { cn } from '@/shared/lib/cn';
import { useBuildingDragStore } from './_store/building-drag.store';

type Props = {
  building: Building;
};

const BuildingMarker = ({ building }: Props) => {
  const { value: isDeleteDialogOpen, setValue: setIsDeleteDialogOpen } = useBoolean(false);
  const { value: isRenameDialogOpen, setValue: setIsRenameDialogOpen } = useBoolean(false);

  const tempLocation = useBuildingDragStore((state) => state.tempLocation);
  const editBuilding = useBuildingDragStore((state) => state.editBuilding);
  const { setTempLocation, cancelDragMode, startEditMode } = useBuildingDragStore(
    (state) => state.actions
  );

  const isEditing = editBuilding?.id === building.id;

  const currentLocation = isEditing && tempLocation ? tempLocation : building.location;

  const handleDragEnd = useCallback(
    (e: MarkerDragEvent) => {
      const newLng = e.lngLat.lng;
      const newLat = e.lngLat.lat;

      setTempLocation({ lng: newLng, lat: newLat });
    },
    [setTempLocation]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditing) {
        cancelDragMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancelDragMode, isEditing]);

  const handleChangeLocation = useCallback(() => {
    startEditMode(building);
  }, [building, startEditMode]);

  return (
    <Marker
      longitude={currentLocation?.lng}
      latitude={currentLocation?.lat}
      anchor="bottom"
      draggable={isEditing}
      onDragEnd={handleDragEnd}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-white px-2 py-1 text-xs font-medium whitespace-nowrap text-gray-800 shadow-md">
              {building.name}
            </div>

            <Link
              href={PATHS.projects.buildingView(building.projectId!, building.id)}
              prefetch={false}
              onClick={(e) => {
                if (isEditing) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <IconMapPinFilled
                className={cn(
                  'h-7 w-7 cursor-pointer transition-transform',
                  isEditing
                    ? 'scale-110 animate-pulse text-orange-500'
                    : 'text-blue-500 hover:scale-105 hover:text-blue-600'
                )}
              />
            </Link>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsRenameDialogOpen(true)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>

          {isEditing ? (
            <ContextMenuItem onClick={cancelDragMode} variant="destructive">
              <IconX className="mr-2 h-4 w-4" />
              Cancel Drag Mode
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={handleChangeLocation}>
              <IconMapSearch className="mr-2 h-4 w-4" />
              Change Location
            </ContextMenuItem>
          )}

          <ContextMenuSeparator />

          <ContextMenuItem onClick={() => setIsDeleteDialogOpen(true)} variant="destructive">
            <IconTrash className="mr-2 h-4 w-4" />
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
