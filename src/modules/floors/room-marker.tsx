import React from 'react';
import { type Room } from '../rooms/_types/room';
import { IconMapPinFilled } from '@tabler/icons-react';

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
      <IconMapPinFilled className="h-7 w-7 text-blue-500 transition-colors hover:text-blue-600" />
    </div>
  );
};

export default RoomMarker;
