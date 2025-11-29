import React from 'react';
import { Room } from '../rooms/_types/room';

type Props = {
  room: Room;
  buildingId: string;
  floorId: string;
};

const RoomMarker = () => {
  return <div>RoomMarker</div>;
};

export default RoomMarker;
