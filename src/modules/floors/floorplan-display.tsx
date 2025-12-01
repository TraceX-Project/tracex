'use client';

import Image from 'next/image';
import { type Floor } from './_types/floor';
import React, { useCallback } from 'react';
import { useRoomStore } from './_store/room.store';
import CreateRoomModal from './create-room-modal';
import { useGetRooms } from './_hooks/use-get-rooms';
import RoomMarker from './room-marker';

type Props = {
  floor: Floor;
};

const FloorPlanDisplay = ({ floor }: Props) => {
  const { setClickedPosition, setIsCreateRoomModalOpen } = useRoomStore((state) => state.actions);
  const { data: rooms } = useGetRooms(floor.id);

  const handleImageClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      setClickedPosition({ x, y });
      setIsCreateRoomModalOpen(true);
    },
    [floor.id, setClickedPosition, setIsCreateRoomModalOpen]
  );

  return (
    <>
      <div className="relative h-full w-full cursor-crosshair" onClick={handleImageClick}>
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
