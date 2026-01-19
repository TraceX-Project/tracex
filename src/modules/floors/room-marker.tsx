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

type Props = {
  room: Room;
};

const RoomMarker = ({ room }: Props) => {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer transition-transform hover:scale-110"
      style={{
        left: `${room.x}%`,
        top: `${room.y}%`,
      }}
      title={room.name}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <IconMapPinFilled className="h-7 w-7 text-blue-500 transition-colors hover:text-blue-600" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <IconEdit className="size-4" />
            Rename
          </ContextMenuItem>

          <ContextMenuItem>
            <IconMapSearch className="size-4" />
            Change Location
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem variant="destructive">
            <IconTrash className="size-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default RoomMarker;
