import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { Layers } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetBuildingById } from './_hooks/use-get-building';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableFloor from './sortable-floor';
import CreateFloorModal from './create-floor-modal';
import { useReorderFloors } from './_hooks/use-reorder-floors';
import { toast } from 'sonner';

type Props = {
  buildingId: string;
};

const ManageFloors = ({ buildingId }: Props) => {
  const { data: building, isLoading } = useGetBuildingById(buildingId);
  const { mutateAsync: reorderFloors } = useReorderFloors();
  const [floors, setFloors] = useState(building?.floors ?? []);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (building?.floors) {
      const sortedFloors = [...building.floors].sort((a, b) => b.sortOrder - a.sortOrder);
      setFloors(sortedFloors);
    }
  }, [building?.floors]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = floors.findIndex((floor) => floor.id === active.id);
      const newIndex = floors.findIndex((floor) => floor.id === over.id);

      if (oldIndex === undefined || newIndex === undefined) {
        return;
      }

      const newFloorsOrder = arrayMove(floors, oldIndex, newIndex);
      const updatedFloors = newFloorsOrder.map((floor, index) => ({
        ...floor,
        sortOrder: index,
      }));

      setFloors(updatedFloors);
    },
    [floors]
  );

  const handleSaveChanges = async () => {
    try {
      await reorderFloors({ buildingId, floors });
      toast.success('Floors reordered successfully.');
    } catch {
      toast.error('Failed to reorder floors. Please try again.');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Layers />
          Manage Floor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Floor</DialogTitle>
        </DialogHeader>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{building?.name}</h2>
            <CreateFloorModal
              buildingId={buildingId}
              variant="outline"
              size="sm"
              title="Add Floor"
            />
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={floors} strategy={verticalListSortingStrategy}>
              {floors.map((floor) => (
                <SortableFloor key={floor.id} floor={floor} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveChanges}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageFloors;
