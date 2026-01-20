'use client';

import Image from 'next/image';
import { type Floor } from './_types/floor';
import React, { useCallback } from 'react';
import CreateRoomModal from './create-room-modal';
import { useGetRooms } from './_hooks/use-get-rooms';
import { useRoomStore } from './_store/room.store';
import { IconMapPin, IconMapPinFilled } from '@tabler/icons-react';
import RoomMarker from './room-marker';

type Props = {
  floor: Floor;
};

const FloorPlanDisplay = ({ floor }: Props) => {
  const { data: rooms } = useGetRooms(floor.id);
  const { setClickedPosition, setIsCreateRoomModalOpen } = useRoomStore((state) => state.actions);
  const clickedPosition = useRoomStore((state) => state.clickedPosition);

  const handleMapClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Prevent triggering if clicking on existing rooms
      if ((event.target as HTMLElement).closest('.room-marker')) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      setClickedPosition({ x, y });
      setIsCreateRoomModalOpen(true);
    },
    [setClickedPosition, setIsCreateRoomModalOpen]
  );

  return (
    <>
      <div
        className="relative h-full w-full cursor-crosshair"
        onClick={handleMapClick}
      >
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
              <div key={room.id} className="pointer-events-auto room-marker">
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
