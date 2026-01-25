import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { IconDotsVertical, IconPencil, IconTrash } from '@tabler/icons-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import DeleteFloorDialog from './delete-floor-dialog';
import { useBoolean } from '@/shared/hooks/use-boolean';
import EditFloorModal from './edit-floor-modal';
import { type Floor } from '../floors/_types/floor';

type Props = {
  floor: Floor;
};

const SortableFloor = ({ floor }: Props) => {
  const { value: isDeleteModalOpen, setValue: setIsDeleteModalOpen } = useBoolean(false)
  const { value: isEditModalOpen, setValue: setIsEditModalOpen } = useBoolean(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: floor.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    setTimeout(() => {
      setIsDeleteModalOpen(true)
    }, 100)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'mb-2 flex cursor-grab items-center justify-between rounded-md border bg-white p-2 active:cursor-grabbing',
          isDragging && 'shadow-lg'
        )}
        {...attributes}
        {...listeners}
      >
        <span className="font-medium">{floor.name}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Project actions"
              className="h-6 w-6 p-1"
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              <IconPencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <IconTrash className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteFloorDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} floorId={floor.id} />
      <EditFloorModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} floor={floor} />
    </>
  );
};

export default SortableFloor;
