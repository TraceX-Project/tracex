'use client';
import { useSortable } from '@dnd-kit/sortable';
import React, { useMemo, useState } from 'react'; // Removed useRef
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/shared/lib/cn';
import { Dialog } from '@/shared/components/ui/dialog';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Device, DeviceInterface, DevicePort } from './_types/room';
import LabelingCanvas from './labeling-canvas';
import useImage from 'use-image';
import Image from 'next/image';
import DeviceTemplate from './device-template';

type Props = {
  device: Device;
};

const SortableDevice = ({ device }: Props) => {
  const deviceInterfaces: DeviceInterface[] = [
    {
      id: '9fa04aea-fa50-4c1d-a9de-7e56e58b8087',
      name: 'GigabitEthernet1/0/1',
      x: 52,
      y: 18,
      width: 17,
      height: 15,
      status: 'connected',
    },

    {
      id: 'e2e03dc5-3242-4454-b952-d10c959a6692',
      name: 'GigabitEthernet1/0/3',
      x: 74,
      y: 18,
      width: 18,
      height: 15,
      status: 'connected',
    },

    {
      id: '9cd3e2d5-a260-44f6-af7f-a68f94680675',
      name: 'GigabitEthernet1/0/5',
      x: 97,
      y: 18,

      width: 17,

      height: 15,

      status: 'connected',
    },

    {
      id: 'd3bd3d5c-3123-4026-a30c-d1877b954a74',

      name: 'GigabitEthernet1/0/6',

      x: 97,

      y: 41,

      width: 17,

      height: 15,

      status: 'connected',
    },

    {
      id: '407b72e4-4ad2-4731-994e-0a7e7d82083f',

      name: 'GigabitEthernet1/0/7',

      x: 119,

      y: 18,

      width: 17,

      height: 15,

      status: 'connected',
    },
  ];

  const [boxes, _] = useState<DevicePort[]>(
    deviceInterfaces.map((d, index) => ({
      id: d.id,
      name: d.name,
      x: d.x,
      y: d.y,
      width: d.width,
      height: d.height,
      portNumber: index + 1,
    }))
  );

  console.log('boxes', boxes);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: device.id,
  });

  // Load image here (or inside LabelingCanvas, but here is fine to cache it)
  const [image] = useImage(device.deviceTemplate.frontPanelUrl ?? '', 'anonymous');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Dialog>
        <DialogTrigger asChild>
          <div 
            role="button"
            className={cn(
              "w-full bg-transparent border-none p-0 focus:outline-none text-left",
              isDragging ? "cursor-grabbing shadow-lg" : "cursor-grab"
            )}
          >
             <DeviceTemplate image={image} boxes={boxes} />
          </div>
        </DialogTrigger>
        <DialogContent className="min-w-5xl w-fit">
          <DialogHeader>
            <DialogTitle>Device Detail</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 w-full">
            <LabelingCanvas image={image} boxes={boxes} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SortableDevice;
