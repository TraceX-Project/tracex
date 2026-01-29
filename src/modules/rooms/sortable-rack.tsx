import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { forwardRef, type ReactNode } from "react";
import { type Rack } from "./_types/room";
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/shared/lib/cn";
import { GripVertical } from "lucide-react";
import RackActionsMenu from "./rack-actions-menu";
import SortableDevice from "./sortable-device";

type Props = {
  rack: Rack;
}

export type RackSortableType = 'rack'

export type RackSortableData = {
  type: RackSortableType,
  rack: Rack
}

export interface RackCardProps extends React.HTMLAttributes<HTMLDivElement> {
  rack: Rack;
  children: ReactNode;
  isDragging?: boolean;
  handleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const RackCard = forwardRef<HTMLDivElement, RackCardProps>(
  ({ rack, children, isDragging, handleProps, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mt-20 flex min-h-[500px] w-[350px] flex-shrink-0 flex-col border-2 border-black bg-white",
          isDragging && "border-primary z-50 shadow-2xl opacity-50",
          className
        )}
        {...props}
      >
        <div
          {...handleProps}
          className="flex h-12 w-full flex-shrink-0 cursor-grab items-center justify-between border-b-2 border-black bg-slate-50 px-2 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-slate-400" />

          <p className="text-sm font-bold uppercase">{rack.name}</p>

          <div
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <RackActionsMenu rack={rack} />
          </div>
        </div>

        <div>{children}</div>
      </div>
    );
  }
);

RackCard.displayName = "RackCard";

const SortableRack = ({ rack }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: rack.id,
    data: {
      type: "rack",
      rack,
    } satisfies RackSortableData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <RackCard
      ref={setNodeRef}
      style={style}
      rack={rack}
      isDragging={isDragging}
      handleProps={{ ...attributes, ...listeners }}
    >
      <SortableContext items={rack.devices.map((device) => device.id)}>
        {rack.devices.map((device) => (
          <SortableDevice key={device.id} device={device} roomId={rack.roomId} />
        ))}
      </SortableContext>
    </RackCard>
  );
};

export default SortableRack;