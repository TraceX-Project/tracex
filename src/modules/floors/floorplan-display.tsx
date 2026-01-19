'use client';

import Image from 'next/image';
import { type Floor } from './_types/floor';
import React from 'react';
import CreateRoomModal from './create-room-modal';
import { useGetRooms } from './_hooks/use-get-rooms';
import RoomMarker from './room-marker';

type Props = {
  floor: Floor;
};

const FloorPlanDisplay = ({ floor }: Props) => {
  const { data: rooms } = useGetRooms(floor.id);

  return (
    <>
      <div className="relative h-full w-full cursor-crosshair" >
        <Image
          src={floor.planUrl}
          alt="Floor Plan"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />

        {rooms && (
          <div className="pointer-events-none absolute inset-0">
            {rooms?.map((room) => (
              <div key={room.id} className="pointer-events-auto">
                <RoomMarker room={room} />
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateRoomModal floorId={floor.id} />
    </>
  );
};

export default FloorPlanDisplay;
