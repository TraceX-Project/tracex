'use client';

import React, { useState } from 'react';
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
  DndContext,
  type DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableRack from './sortable-rack';
import { useGetRacks } from './_hooks/use-get-racks';

const ManageRacks = ({ roomId }: { roomId: string }) => {
  const { data: allRacks, isLoading } = useGetRacks(roomId);
  const [racks, setRacks] = useState(allRacks || []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: string) => {
    if (racks.find((r) => r.id === id)) return id;
    return racks.find((rack) => rack.devices.some((d) => d.id === id))?.id;
  };

  const findRackByDeviceId = (deviceId: string) =>
    racks.find((r) => r.devices.some((d) => d.id === deviceId));

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeRack = findRackByDeviceId(activeId);
    const overRack =
      racks.find((r) => r.id === overId) || // hovering rack
      findRackByDeviceId(overId); // hovering device

    if (!activeRack || !overRack) return;
    if (activeRack.id === overRack.id) return;

    setRacks((prev) => {
      const activeDevice = activeRack.devices.find((d) => d.id === activeId)!;

      return prev.map((rack) => {
        if (rack.id === activeRack.id) {
          return {
            ...rack,
            devices: rack.devices.filter((d) => d.id !== activeId),
          };
        }
        if (rack.id === overRack.id) {
          return {
            ...rack,
            devices: [...rack.devices, activeDevice],
          };
        }
        return rack;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // CASE 1: Reordering Racks
    if (racks.some((r) => r.id === activeId)) {
      const oldIndex = racks.findIndex((r) => r.id === activeId);
      const newIndex = racks.findIndex((r) => r.id === overId);
      if (oldIndex !== newIndex) {
        setRacks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
      return;
    }

    // CASE 2: Finalizing Device Position (within the same rack)
    const container = findContainer(activeId);
    if (container) {
      const rackIndex = racks.findIndex((r) => r.id === container);
      const rackDevices = racks[rackIndex].devices;
      const oldIndex = rackDevices.findIndex((d) => d.id === activeId);
      const newIndex = rackDevices.findIndex((d) => d.id === overId);

      if (oldIndex !== newIndex) {
        setRacks((prev) => {
          const newRacks = [...prev];
          newRacks[rackIndex].devices = arrayMove(rackDevices, oldIndex, newIndex);
          return newRacks;
        });
      }
    }
  };

  return (
    <div className="h-full w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full w-full flex-nowrap gap-8 overflow-x-auto px-10 pb-4">
          <SortableContext items={racks.map((r) => r.id)} strategy={horizontalListSortingStrategy}>
            {racks.map((rack) => (
              <SortableRack
                key={rack.id}
                id={rack.id}
                name={rack.name}
                devices={rack.devices}
                roomId={roomId}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default ManageRacks;
