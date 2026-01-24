import React from 'react';
import { type Room } from '../rooms/_types/room';
import { IconEdit, IconMapPinFilled, IconMapSearch, IconTrash } from '@tabler/icons-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { useRoomStore } from './_store/room.store';
import RenameRoomDialog from './rename-room-dialog';
import DeleteRoomDialog from './delete-room-dialog';
import { useParams, useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';

type Props = {
  room: Room;
};

const RoomMarker = ({ room }: Props) => {
  const router = useRouter();
  const { projectId, buildingId, floorId } = useParams<{
    projectId: string;
    buildingId: string;
    floorId: string;
  }>();
  const { value: isRenameDialogOpen, setValue: setIsRenameDialogOpen } = useBoolean(false);
  const { value: isDeleteDialogOpen, setValue: setIsDeleteDialogOpen } = useBoolean(false);
  const { setMovingRoomId, setCursorPosition } = useRoomStore((state) => state.actions);

  const handleNavigate = () => {
    router.push(PATHS.projects.roomView(projectId, buildingId, floorId, room.id));
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();

    setTimeout(() => {
      setIsRenameDialogOpen(true);
    }, 100);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    setTimeout(() => {
      setIsDeleteDialogOpen(true);
    }, 100);
  };

  const handleChangeLocation = (e: React.MouseEvent) => {
    e.stopPropagation();

    const mapElement = document.getElementById('floor-plan-map');
    if (!mapElement) return;

    const rect = mapElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTimeout(() => {
      setMovingRoomId(room.id);
      setCursorPosition({ x, y });
    }, 100);
  };

  return (
    <>
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer transition-transform hover:scale-110"
        style={{
          left: `${room.x}%`,
          top: `${room.y}%`,
        }}
        onClick={handleNavigate}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconMapPinFilled className="size-7 text-blue-500 transition-colors hover:text-blue-600" />
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={-6}>
                <p>{room.name}</p>
              </TooltipContent>
            </Tooltip>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={handleRename}>
              <IconEdit className="size-4" />
              Rename
            </ContextMenuItem>

            <ContextMenuItem onClick={handleChangeLocation}>
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
      </div>

      <RenameRoomDialog
        room={room}
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
      />

      <DeleteRoomDialog
        room={room}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
};

export default RoomMarker;
