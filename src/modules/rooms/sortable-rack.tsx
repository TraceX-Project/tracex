'use client';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useCallback, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import SortableDevice from './sortable-device';

type Props = {
    name: string;
    id: string;
};

const SortableRack = ({ name, id }: Props) => {
    const [devices, setDevices] = useState([{id: '1', name: 'Device 1',frontPanelURL:'https://nc.agogfox.cc/apps/files_sharing/publicpreview/P5wfkyFfCQ3TDk8?file=/panels/Cisco/C9200L-48P-4G.png&fileId=8036&x=3360&y=2100&a=true&etag=aa3e18e5b6b0232cdefe2b35f8ac4401'}, {id: '2', name: 'Device 2',frontPanelURL:"https://nc.agogfox.cc/apps/files_sharing/publicpreview/P5wfkyFfCQ3TDk8?file=/panels/Cisco/ASR-9901.png&fileId=8038&x=3360&y=2100&a=true&etag=38b826ab6a89bb902ad5a2d21d04d4c1"}, {id: '3', name: 'Device 3',frontPanelURL:"https://nc.agogfox.cc/apps/files_sharing/publicpreview/P5wfkyFfCQ3TDk8?file=/panels/Dell/PowerSwitch%20E3248P-ON.png&fileId=8004&x=3360&y=2100&a=true&etag=ffc6fbbfbe72030cef6f076056eac738"}]);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
      );
    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
          const { active, over } = event;
    
          if (!over || active.id === over.id) {
            return;
          }
    
          const oldIndex = devices.findIndex((device) => device.id === active.id);
          const newIndex = devices.findIndex((device) => device.id === over.id);
    
          if (oldIndex === undefined || newIndex === undefined) {
            return;
          }
    
          const newDevicesOrder = arrayMove(devices, oldIndex, newIndex);
          const updatedDevices = newDevicesOrder.map((device, index) => ({
            ...device,
            sortOrder: index,
          }));
    
          setDevices(updatedDevices);
        },
        [devices]
      );


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
            className={cn(
                'mb-2 min-w-xs flex flex-col border-2 border-black bg-white mt-20 cursor-grab active:cursor-grabbing',
                isDragging && 'shadow-lg z-50'
            )}
        >
            <div className='grid grid-cols-3 border-b-2 border-black w-full h-10 items-center px-4'>
                <div />
                <span className="font-medium text-center truncate">
                    {name}
                </span>
                <div className="flex justify-end">
                    <Button
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <Plus />
                    </Button>
                </div>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full h-full">
                    <SortableContext items={devices} strategy={verticalListSortingStrategy} >
                        {devices.map((device) => (
                            <SortableDevice key={device.id} id={device.id} frontURL={device.frontPanelURL || '/images/device/front-placeholder.png'} />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
};

export default SortableRack;
