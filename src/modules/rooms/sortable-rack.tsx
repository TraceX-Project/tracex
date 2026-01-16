'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';
import SortableDevice from './sortable-device';
import AddDevicesModal from './add-devices-modal';

const SortableRack = ({ name, id, devices }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [addDevicesOpen, setAddDevicesOpen] = useState(false);

  const { setNodeRef: setDroppableRef } = useDroppable({ id });
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'mt-20 flex min-h-[500px] w-[350px] flex-shrink-0 flex-col border-2 border-black bg-white',
        isDragging && 'border-primary z-50 shadow-2xl'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex h-12 w-full flex-shrink-0 cursor-grab items-center justify-between border-b-2 border-black bg-slate-50 px-2 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-bold uppercase">{name}</span>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <AddDevicesModal rackId={id} />
        </div>
      </div>

      {/* Device sorting area - No DndContext here! */}
      <div className="flex flex-1 flex-col">
        <SortableContext
          items={devices.map((d: any) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {devices.map((device: any) => (
            <SortableDevice key={device.id} id={device.id} frontURL={device.frontPanelURL} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
export default SortableRack;
