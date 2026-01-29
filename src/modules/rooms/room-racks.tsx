import { DndContext, type DragEndEvent, useSensor, useSensors, PointerSensor, closestCorners, type DragOverEvent } from "@dnd-kit/core";
import { type Rack } from "./_types/room";
import { horizontalListSortingStrategy, SortableContext, arrayMove } from "@dnd-kit/sortable";
import SortableRack from "./sortable-rack";
import { type DeviceSortableData } from "./sortable-device";
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

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeType = active.data.current?.type as "rack" | "device";
    const overType = over.data.current?.type as "rack" | "device";

    if (activeType !== "device") return;

    const activeRack = sortedRacks.find((r) =>
      r.devices.some((d) => d.id === activeId)
    );
    const overRack =
      overType === "rack"
        ? sortedRacks.find((r) => r.id === overId)
        : sortedRacks.find((r) => r.devices.some((d) => d.id === overId));

    if (!activeRack || !overRack) return;

    // CASE 1 - Same rack reordering
    if (activeRack.id === overRack.id) {
      const oldIndex = activeRack.devices.findIndex((d) => d.id === activeId);
      const newIndex =
        overType === "device"
          ? overRack.devices.findIndex((d) => d.id === overId)
          : overRack.devices.length;

      if (oldIndex !== newIndex && newIndex !== -1) {
        setSortedRacks((prev) =>
          prev.map((r) => {
            if (r.id === activeRack.id) {
              return {
                ...r,
                devices: arrayMove(r.devices, oldIndex, newIndex),
              };
            }
            return r;
          })
        );
      }
      return;
    }

    // CASE 2 - Different rack - move device visually
    setSortedRacks((prev) => {
      const activeRack = prev.find((r) =>
        r.devices.some((d) => d.id === activeId)
      );
      const overRack =
        overType === "rack"
          ? prev.find((r) => r.id === overId)
          : prev.find((r) => r.devices.some((d) => d.id === overId));

      if (!activeRack || !overRack) return prev;

      const activeDevice = activeRack.devices.find((d) => d.id === activeId);
      if (!activeDevice) return prev;

      return prev.map((rack) => {
        if (rack.id === activeRack.id) {
          return {
            ...rack,
            devices: rack.devices.filter((d) => d.id !== activeId),
          };
        }

        if (rack.id === overRack.id) {
          const newDevices = [...rack.devices];
          if (overType === "device") {
            const overIndex = newDevices.findIndex((d) => d.id === overId);
            if (overIndex >= 0) {
              newDevices.splice(overIndex, 0, activeDevice);
            } else {
              newDevices.push(activeDevice);
            }
          } else {
            newDevices.push(activeDevice);
          }
          return {
            ...rack,
            devices: newDevices,
          };
        }
        return rack;
      });
    });
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeType = active.data.current?.type as "rack" | "device";
    const overType = over.data.current?.type as "rack" | "device";

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

    // Case 2 -> device to device
    if (activeType === "device") {
      const activeData = active.data.current as DeviceSortableData;
      const overData = over.data.current as DeviceSortableData;

      const activeRackId = activeData?.device?.rackId;
      const overRackId =
        overType === "device"
          ? overData?.device?.rackId
          : overType === "rack"
            ? overId
            : null;

      if (!activeRackId || !overRackId) return;

      if (activeRackId === overRackId) {
        const rack = sortedRacks.find(r => r.id === activeRackId);
        if (rack) {
          const oldIndex = rack.devices.findIndex(d => d.id === activeId);
          const newIndex = rack.devices.findIndex(d => d.id === overId);

          if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
            setSortedRacks(prev => prev.map(r => {
              if (r.id === activeRackId) {
                return { ...r, devices: arrayMove(r.devices, oldIndex, newIndex) }
              }

              return r;
            }));
          }
        }
        return;
      }

      return;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
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