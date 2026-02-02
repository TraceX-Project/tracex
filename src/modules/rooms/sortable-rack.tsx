import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { forwardRef, type ReactNode } from "react";
import { type Rack } from "./_types/room";
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/shared/lib/cn";
import { GripVertical } from "lucide-react";
import RackActionsMenu from "./rack-actions-menu";
import SortableDevice from "./sortable-device";
import { useDroppable } from "@dnd-kit/core";
import { isSlotOccupied } from "./_utils/rack";

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
          "mt-20 flex min-h-[500px] max-h-[80vh] w-[350px] flex-shrink-0 flex-col border-2 border-black bg-white",
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

          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase">{rack.name}</p>
            <p className={cn("text-xs text-muted-foreground")}>
              Used: {rack.usedUnits} / {rack.unitSize} U
            </p>
          </div>

          <div
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <RackActionsMenu rack={rack} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    );
  }
);

RackCard.displayName = "RackCard";

const UNIT_HEIGHT = 22; // Height of 1U in pixels
const DEFAULT_UNIT_SIZE = 42;


type RackUnitProps = {
  uPosition: number;
  rackId: string;
  isOccupied?: boolean;
}

const RackUnit = ({ uPosition, rackId, isOccupied }: RackUnitProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `rack-unit:${rackId}:${uPosition}`,
    data: {
      type: 'rack-unit',
      uPosition,
      rackId,
      isOccupied,
    },
  });

  return (
    <>
      <div
        className="absolute left-0 w-6 border-r border-slate-300 bg-slate-200 flex items-center justify-center text-[9px] text-slate-500 font-medium select-none"
        style={{
          bottom: `${(uPosition - 1) * UNIT_HEIGHT}px`,
          height: `${UNIT_HEIGHT}px`,
          zIndex: 5,
        }}
      >
        {uPosition}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "absolute right-0 w-[calc(100%-24px)] border-t border-slate-200/50",
          isOver && !isOccupied && "bg-blue-100/50"
        )}
        style={{
          bottom: `${(uPosition - 1) * UNIT_HEIGHT}px`,
          height: `${UNIT_HEIGHT}px`,
          zIndex: 0,
        }}
      />
    </>
  );
};

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

  const sortedDevices = [...rack.devices].sort((a, b) => (b.uPosition ?? 0) - (a.uPosition ?? 0));

  return (
    <RackCard
      ref={setNodeRef}
      style={style}
      rack={rack}
      isDragging={isDragging}
      handleProps={{ ...attributes, ...listeners }}
      className="w-[280px]"
    >
      <div
        className="relative w-full border-b border-black bg-slate-100"
        style={{
          height: (rack.unitSize ?? DEFAULT_UNIT_SIZE) * UNIT_HEIGHT,
        }}
      >
        {Array.from({ length: rack.unitSize ?? DEFAULT_UNIT_SIZE }).map((_, index) => {
          const u = index + 1;
          return (
            <RackUnit
              key={u}
              uPosition={u}
              rackId={rack.id}
              isOccupied={isSlotOccupied(u, rack.devices)}
            />
          );
        })}

        <SortableContext items={sortedDevices.map((device) => device.id)}>
          {sortedDevices.map((device) => (
            <SortableDevice
              key={device.id}
              device={device}
              roomId={rack.roomId}
              style={{
                position: 'absolute',
                left: '24px',
                width: 'calc(100% - 24px)',
                bottom: `${(device.uPosition - 1) * UNIT_HEIGHT}px`,
                height: `${(device.deviceTemplate.unitSize || 1) * UNIT_HEIGHT}px`,
                zIndex: 10,
              }}
            />
          ))}
        </SortableContext>
      </div>
    </RackCard>
  );
};

export default SortableRack;