import { DndContext, type DragEndEvent, useSensor, useSensors, PointerSensor, closestCorners } from "@dnd-kit/core";
import { type Rack } from "./_types/room";
import { horizontalListSortingStrategy, SortableContext, arrayMove } from "@dnd-kit/sortable";
import SortableRack from "./sortable-rack";
import { useState, useEffect } from "react";
import { restrictRackToContainer } from "./_utils/dnd-modifiers";
import { useReorderRacks } from "./_hooks/use-reorder-racks";
import { useAddDevicesToRack } from "./_hooks/use-add-devices-to-rack";

type Props = {
  roomId: string;
  racks: Rack[];
}

const RoomRacks = ({ roomId, racks }: Props) => {
  const [sortedRacks, setSortedRacks] = useState<Rack[]>(racks);
  const { mutateAsync: reorderRacks } = useReorderRacks();
  const { mutateAsync: addDevicesToRack } = useAddDevicesToRack();

  useEffect(() => {
    setSortedRacks(racks);
  }, [racks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeType = active.data.current?.type as "rack" | "device";
    const overType = over.data.current?.type as "rack" | "device" | "rack-unit";

    // Case 1 -> rack to rack
    if (activeType === "rack" && overType === "rack") {
      const oldIndex = sortedRacks.findIndex((r) => r.id === activeId);
      const newIndex = sortedRacks.findIndex((r) => r.id === overId);

      if (oldIndex === newIndex) return;

      const newRacks = arrayMove(sortedRacks, oldIndex, newIndex);
      setSortedRacks(newRacks);

      try {
        await reorderRacks({
          roomId,
          racks: newRacks.map((rack, index) => ({
            id: rack.id,
            sortOrder: index + 1,
          })),
        });
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // Case 2 -> Device Interaction
    if (activeType === "device") {
      if (overId.startsWith("rack-unit:")) {
        const [, rackId, uPosStr] = overId.split(":");
        const uPosition = parseInt(uPosStr, 10);

        try {
          await addDevicesToRack({
            rackId,
            roomId,
            data: {
              devices: [{
                deviceId: activeId,
                uPosition
              }]
            }
          });
        } catch (error) {
          console.error("Failed to move device", error);
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      modifiers={[restrictRackToContainer]}
    >
      <div className="flex px-4 overflow-x-auto pb-4 gap-4 w-full h-full">
        <SortableContext
          items={sortedRacks.map(r => r.id)}
          strategy={horizontalListSortingStrategy}
        >
          {sortedRacks.map(rack => <SortableRack key={rack.id} rack={rack} />)}
        </SortableContext>
      </div>
    </DndContext>
  );
}

export default RoomRacks