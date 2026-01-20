import { IconMapPinFilled } from '@tabler/icons-react';
import React from 'react';
import { useRoomStore } from './_store/room.store';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/cn';

const GhostMarker = () => {
  const movingRoomId = useRoomStore((state) => state.movingRoomId);
  const cursorPosition = useRoomStore((state) => state.cursorPosition);

  if (!movingRoomId || !cursorPosition) return null;

  return (
    <div
      className="pointer-events-none absolute z-50 flex flex-col items-center"
      style={{
        left: `${cursorPosition.x}%`,
        top: `${cursorPosition.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <TooltipProvider>
        <TooltipPrimitive.Root open={true}>
          <TooltipPrimitive.Trigger asChild>
            <IconMapPinFilled className="size-8 text-blue-500 opacity-70" />
          </TooltipPrimitive.Trigger>

          {/* 
            Optimized Tooltip Content:
            - No Portal: Renders directly in DOM flow so it moves instantly with parent
            - avoidCollisions={false}: Prevents expensive collision math on every frame
          */}
          <TooltipPrimitive.Content
            side="right"
            sideOffset={5}
            avoidCollisions={false}
            className={cn(
              'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 z-50 w-fit rounded-md px-3 py-1.5 text-xs'
            )}
          >
            Click to place
            <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Root>
      </TooltipProvider>
    </div>
  );
};

export default GhostMarker;
