'use client';

import React, { useEffect, useState } from 'react';
import {
  useSensors,
  useSensor,
  KeyboardSensor,
  type DragEndEvent,
  DndContext,
  type DragOverEvent,
  closestCorners,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableRack from './sortable-rack';
import { useGetRacks } from './_hooks/use-get-racks';
import { Device, getRacksResponse } from './_types/room';

const ManageRacks = ({ roomId }: { roomId: string }) => {
  const { data: allRacks } = useGetRacks(roomId);
  const [racks, setRacks] = useState(allRacks ?? []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: string) => {
    if (racks.find((r:getRacksResponse) => r.id === id)) return id;
    return racks.find((rack:getRacksResponse) => rack.devices.some((d:Device) => d.id === id))?.id;
  };

  const findRackByDeviceId = (deviceId: string) =>
    racks.find((r:getRacksResponse) => r.devices.some((d:Device) => d.id === deviceId));

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeRack = findRackByDeviceId(activeId);
    const overRack =
      racks.find((r:getRacksResponse) => r.id === overId) ?? // hovering rack
      findRackByDeviceId(overId); // hovering device

    if (!activeRack || !overRack) return;
    if (activeRack.id === overRack.id) return;

    setRacks((prev) => {
      const activeDevice = activeRack.devices.find((d:Device) => d.id === activeId)!;

      return prev.map((rack:getRacksResponse) => {
        if (rack.id === activeRack.id) {
          return {
            ...rack,
            devices: rack.devices.filter((d:Device) => d.id !== activeId),
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
    if (racks.some((r:getRacksResponse) => r.id === activeId)) {
      const oldIndex = racks.findIndex((r:getRacksResponse) => r.id === activeId);
      const newIndex = racks.findIndex((r:getRacksResponse) => r.id === overId);
      if (oldIndex !== newIndex) {
        setRacks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
      return;
    }

    // CASE 2: Finalizing Device Position (within the same rack)
    const container = findContainer(activeId);
    if (container) {
      const rackIndex = racks.findIndex((r:getRacksResponse) => r.id === container);
      const rackDevices = racks[rackIndex].devices;
      const oldIndex = rackDevices.findIndex((d:Device) => d.id === activeId);
      const newIndex = rackDevices.findIndex((d:Device) => d.id === overId);

      if (oldIndex !== newIndex) {
        setRacks((prev) => {
          const newRacks = [...prev];
          newRacks[rackIndex].devices = arrayMove(rackDevices, oldIndex, newIndex);
          return newRacks;
        });
      }
    }
  };

  useEffect(() => {
    if (allRacks) {
      console.log(allRacks);
    }
  }, [allRacks]);

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
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default ManageRacks;
