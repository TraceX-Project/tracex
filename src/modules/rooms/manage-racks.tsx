'use client';

import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useGetRacks } from "./_hooks/use-get-racks";
import { toast } from "sonner";
import { Dialog,DialogHeader, DialogFooter } from "@/shared/components/ui/dialog";
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DragEndEvent, DndContext, closestCenter } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@radix-ui/react-dialog";
import { Layers } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import CreateFloorModal from "../buildings/create-floor-modal";
import SortableRack from "./sortable-rack";
// import SortableFloor from "../buildings/sortable-floor";

type Props = {
  roomId: string;
};

const ManageRacks = ({ roomId }: Props) => {
//   const { data: racks, isLoading } = useGetRacks(roomId);
//   const { mutateAsync: reorderRacks } = useReorderRacks();
  const [racks, setRacks] = useState([{id: '1', name: 'Rack 1'}, {id: '2', name: 'Rack 2'}, {id: '3', name: 'Rack 3'},{id: '4', name: 'Rack 4'}, {id: '5', name: 'Rack 5'}, {id: '6', name: 'Rack 6'}]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

//   useEffect(() => {
//     if (building?.floors) {
//       const sortedFloors = [...building.floors].sort((a, b) => a.sortOrder - b.sortOrder);
//       setFloors(sortedFloors);
//     }
//   }, [building?.floors]);

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

//   const handleSaveChanges = async () => {
//     try {
//       await reorderRacks({ roomId, racks });
//       toast.success('Racks reordered successfully.');
//     } catch {
//       toast.error('Failed to reorder racks. Please try again.');
//     }
//   };

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
