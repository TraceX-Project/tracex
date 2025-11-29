import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';

type Props = {
  name: string;
  id: string;
};

const SortableFloor = ({ name, id }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'mb-2 flex items-center justify-between rounded-md border bg-white p-2',
        isDragging && 'shadow-lg'
      )}
    >
      <span className="font-medium">{name}</span>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SortableFloor;
