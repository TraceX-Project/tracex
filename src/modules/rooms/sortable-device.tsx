'use client';
import { useSortable } from '@dnd-kit/sortable';
import React, { useMemo, useRef } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/shared/lib/cn';
import { Dialog } from '@/shared/components/ui/dialog';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { type RackDevice } from './_types/room';
import DevicePortMap from './device-port-map';

type Props = {
  device: RackDevice;
};

const SortableDevice = ({ device }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: device.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Dialog>
        <DialogTrigger asChild>
          <div
            role="button"
            className={cn(
              'w-full border-none bg-transparent p-0 text-left focus:outline-none cursor-grab',
              isDragging && 'cursor-grabbing shadow-lg'
            )}
            {...listeners}
          >
            <DevicePortMap device={device} />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{device.name}</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <div className="relative flex min-h-[200px] w-full items-center justify-center overflow-hidden rounded-md border bg-slate-100 p-6">
              <DevicePortMap device={device} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SortableDevice;
