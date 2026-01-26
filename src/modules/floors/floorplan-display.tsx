'use client';

import { useResizeObserver } from '@/shared/hooks/use-resize-observer';
import Image from 'next/image';
import { type Floor } from './_types/floor';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const { setClickedPosition, setIsCreateRoomModalOpen, setMovingRoomId, setCursorPosition } =
    useRoomStore((state) => state.actions);
  const movingRoomId = useRoomStore((state) => state.movingRoomId);

  const { mutateAsync: updateRoom } = useUpdateRoom();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth = 0, height: containerHeight = 0 } = useResizeObserver({
    ref: containerRef as React.RefObject<HTMLElement>,
  });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const displaySize = useMemo(() => {
    if (!naturalSize.width || !naturalSize.height || !containerWidth || !containerHeight) {
      return { width: 0, height: 0 };
    }

    const imageRatio = naturalSize.width / naturalSize.height;
    const containerRatio = containerWidth / containerHeight;

    let width, height;

    if (containerRatio > imageRatio) {
      height = containerHeight;
      width = height * imageRatio;
    } else {
      width = containerWidth;
      height = width / imageRatio;
    }

    return { width, height };
  }, [containerWidth, containerHeight, naturalSize]);

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
        ref={containerRef}
        className={cn(
          'relative flex h-full w-full items-center justify-center overflow-hidden select-none',
          movingRoomId && 'cursor-none'
        )}
        onMouseLeave={() => setCursorPosition(null)}
      >
        <div
          id="floor-plan-map"
          className="relative cursor-crosshair"
          style={{
            width: displaySize.width,
            height: displaySize.height,
          }}
          onClick={handleMapClick}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={floor.planUrl}
            alt="Floor Plan"
            fill
            className="object-contain pointer-events-none"
            onLoadingComplete={(img) => {
              setNaturalSize({
                width: img.naturalWidth,
                height: img.naturalHeight,
              });
            }}
            priority
          />

          <GhostMarker />

          {rooms && naturalSize.width > 0 && naturalSize.height > 0 && (
            <div className="pointer-events-none absolute inset-0">
              {rooms
                ?.filter((room) => movingRoomId !== room.id)
                .map((room) => (
                  <div key={room.id} className="room-marker pointer-events-auto">
                    <RoomMarker room={room} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <CreateRoomModal floorId={floor.id} />
    </>
  );
};

export default FloorPlanDisplay;
