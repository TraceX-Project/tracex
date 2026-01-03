'use client';

import React from "react";
import { useCallback, useState } from "react";
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DragEndEvent, DndContext, closestCenter } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import SortableRack from "./sortable-rack";

type Props = {
  roomId: string;
};

const ManageRacks = ({ roomId }: Props) => {

  const [racks, setRacks] = useState([{id: '1', name: 'Rack 1'}, {id: '2', name: 'Rack 2'}, {id: '3', name: 'Rack 3'},{id: '4', name: 'Rack 4'}, {id: '5', name: 'Rack 5'}, {id: '6', name: 'Rack 6'}]);
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

      const oldIndex = racks.findIndex((rack) => rack.id === active.id);
      const newIndex = racks.findIndex((rack) => rack.id === over.id);

      if (oldIndex === undefined || newIndex === undefined) {
        return;
      }

      const newRacksOrder = arrayMove(racks, oldIndex, newIndex);
      const updatedRacks = newRacksOrder.map((rack, index) => ({
        ...rack,
        sortOrder: index,
      }));

      setRacks(updatedRacks);
    },
    [racks]
  );

  return (
        <div className="w-full h-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="w-full h-full flex gap-5 px-10 overflow-x-scroll">
            <SortableContext items={racks} strategy={horizontalListSortingStrategy} >
                {racks.map((rack) => (
                    <SortableRack key={rack.id} id={rack.id} name={rack.name} />
                ))}
            </SortableContext>
            </div>
          </DndContext>
        </div>
  );
};

export default ManageRacks;
