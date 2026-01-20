'use client';

import Image from 'next/image';
import { type Floor } from './_types/floor';
import React, { useCallback, useEffect, useRef } from 'react';
import CreateRoomModal from './create-room-modal';
import { useGetRooms } from './_hooks/use-get-rooms';
import { useUpdateRoom } from './_hooks/use-update-room';
import { useRoomStore } from './_store/room.store';
import RoomMarker from './room-marker';
import { cn } from '@/shared/lib/cn';
import GhostMarker from './ghost-marker';

type Props = {
  floor: Floor;
};

const FloorPlanDisplay = ({ floor }: Props) => {
  const { data: rooms } = useGetRooms(floor.id);
  const { setClickedPosition, setIsCreateRoomModalOpen, setMovingRoomId, setCursorPosition } = useRoomStore((state) => state.actions);
  const movingRoomId = useRoomStore((state) => state.movingRoomId);

  const { mutateAsync: updateRoom } = useUpdateRoom();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMovingRoomId(null);
        setCursorPosition(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMovingRoomId, setCursorPosition]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!movingRoomId) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      setCursorPosition({ x, y });
    },
    [movingRoomId]
  );

  const handleMapClick = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      // Prevent triggering if click comes from outside the container (e.g. context menu portals)
      if (!event.currentTarget.contains(event.target as Node)) return;

      // Prevent triggering if clicking on existing rooms
      if ((event.target as HTMLElement).closest('.room-marker')) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      if (movingRoomId) {
        try {
          await updateRoom({
            roomId: movingRoomId,
            payload: { x, y },
            floorId: floor.id,
          });
        } catch (error) {
          console.error(error);
        } finally {
          setMovingRoomId(null);
          setCursorPosition(null);
        }

        return;
      }

      setClickedPosition({ x, y });
      setIsCreateRoomModalOpen(true);
    },
    [setClickedPosition, setIsCreateRoomModalOpen, movingRoomId, setMovingRoomId, updateRoom]
  );

  return (
    <>
      <div
        id="floor-plan-map"
        ref={containerRef}
        className={cn('relative h-full w-full cursor-crosshair', movingRoomId && 'cursor-none')}
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCursorPosition(null)}
      >
        <Image
          src={floor.planUrl}
          alt="Floor Plan"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />

        <GhostMarker />

        {rooms && (
          <div className="pointer-events-none absolute inset-0">
            {rooms?.filter((room) => movingRoomId !== room.id).map((room) => (
              <div key={room.id} className='pointer-events-auto room-marker'>
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
