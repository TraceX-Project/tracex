import React from 'react';
import { type Room } from '../rooms/_types/room';
import { IconEdit, IconMapPinFilled, IconMapSearch, IconTrash } from '@tabler/icons-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/shared/components/ui/context-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import { useBoolean } from '@/shared/hooks/use-boolean';
import RenameRoomDialog from './rename-room-dialog';
import DeleteRoomDialog from './delete-room-dialog';

type Props = {
  room: Room;
};

const RoomMarker = ({ room }: Props) => {
  const { value: isRenameDialogOpen, setValue: setIsRenameDialogOpen } = useBoolean(false);
  const { value: isDeleteDialogOpen, setValue: setIsDeleteDialogOpen } = useBoolean(false);

  return (
    <>
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer transition-transform hover:scale-110"
        style={{
          left: `${room.x}%`,
          top: `${room.y}%`,
        }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <Tooltip>
              <TooltipTrigger>
                <IconMapPinFilled className="size-8 text-blue-500 transition-colors hover:text-blue-600" />
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>{room.name}</p>
              </TooltipContent>
            </Tooltip>

          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => setIsRenameDialogOpen(true)}>
              <IconEdit className="size-4" />
              Rename
            </ContextMenuItem>

            <ContextMenuItem>
              <IconMapSearch className="size-4" />
              Change Location
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
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
