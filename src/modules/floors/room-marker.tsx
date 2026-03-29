import React, { useCallback } from 'react';
import { type Room } from '../rooms/_types/room';
import { IconEdit, IconMapSearch, IconServer, IconTrash } from '@tabler/icons-react';
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
import { useParams, useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { useDeleteRoom } from './_hooks/use-delete-room';
import { toast } from 'sonner';

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
  const { mutateAsync: deleteRoom } = useDeleteRoom();

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

  const handleDeleteRoom = useCallback(async () => {
    try {
      await deleteRoom(room.id);
      setIsDeleteDialogOpen(false);

      toast.success('Room deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete room');
    }
  }, [room.id, deleteRoom]);

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
                <div className="flex flex-col items-center">
                  <div className="rounded-lg bg-green-400 p-1.5 shadow-[0_0_10px_2px_rgba(74,222,128,0.7)] transition-all hover:bg-green-300 hover:shadow-[0_0_16px_4px_rgba(74,222,128,0.9)]">
                    <IconServer className="size-5 text-white" />
                  </div>
                  <div className="h-3 w-0.5 bg-green-400" />
                  <div className="size-1.5 rounded-full bg-green-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={-6}>
                <p>{room.name} test</p>
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

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Are you sure?"
        description={`This action cannot be undone. This will permanently delete the room "${room.name}" and remove all associated data.`}
        onConfirm={handleDeleteRoom}
      />
    </>
  );
};

export default RoomMarker;
