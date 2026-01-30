import { useSortable } from '@dnd-kit/sortable';
import { type RackDevice } from './_types/room';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import DevicePortMap from './device-port-map';
import { cn } from '@/shared/lib/cn';
import { useCallback, forwardRef } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu';
import { IconTrash, IconReplace } from '@tabler/icons-react';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { useRemoveDeviceFromRack } from './_hooks/use-remove-device-from-rack';
import { toast } from 'sonner';
import MoveToRackModal from './move-to-rack-modal';

type Props = {
  device: RackDevice;
  roomId: string;
};

export type DeviceSortableType = 'device';

export type DeviceSortableData = {
  type: DeviceSortableType;
  device: RackDevice;
};

export interface DeviceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: RackDevice;
  isDragging?: boolean;
}

export const DeviceCard = forwardRef<HTMLDivElement, DeviceCardProps>(
  ({ device, isDragging, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          'w-full cursor-grab border-none bg-transparent p-0 text-left focus:outline-none',
          isDragging && 'cursor-grabbing opacity-50 shadow-lg',
          className
        )}
      >
        <DevicePortMap device={device} />
      </div>
    );
  }
);

DeviceCard.displayName = 'DeviceCard';

const SortableDevice = ({ device, roomId }: Props) => {
  const { value: isDialogOpen, setValue: setIsDialogOpen } = useBoolean();
  const { mutateAsync: removeDeviceFromRack } = useRemoveDeviceFromRack();
  const { value: removeDeviceDialog, setValue: setRemoveDeviceDialog } = useBoolean();
  const { value: moveToRackDialog, setValue: setMoveToRackDialog } = useBoolean();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: device.id,
    data: {
      type: 'device',
      device,
    } satisfies DeviceSortableData,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleViewDetails = useCallback(() => {
    setTimeout(() => setIsDialogOpen(true), 100);
  }, []);

  const handleRemoveDialog = useCallback(() => {
    setTimeout(() => setRemoveDeviceDialog(true), 100);
  }, []);

  const handleOpenMoveToRack = useCallback(() => {
    setTimeout(() => setMoveToRackDialog(true), 100);
  }, []);

  const handleRemoveDeviceFromRack = useCallback(async () => {
    try {
      await removeDeviceFromRack({ rackId: device.rackId, deviceId: device.id, roomId });

      setRemoveDeviceDialog(false);

      toast.success(`Remove ${device.name} from rack successfully`);
    } catch (error) {
      toast.error(`Failed to remove ${device.name} from rack`);
    }
  }, [device, removeDeviceFromRack]);

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <ContextMenu>
            <ContextMenuTrigger>
              <DeviceCard
                device={device}
                isDragging={isDragging}
                onClick={handleViewDetails}
                {...listeners}
              />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleOpenMoveToRack}>
                <IconReplace className="size-4" />
                Move to Rack
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive" onClick={handleRemoveDialog}>
                <IconTrash className="size-4" />
                Remove
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{device.name}</DialogTitle>
            </DialogHeader>
            <div className="w-full">
              <div className="relative flex min-h-[200px] w-full items-center justify-center overflow-hidden rounded-md border bg-slate-100 p-6">
                <DevicePortMap device={device} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ConfirmDialog
        open={removeDeviceDialog}
        onOpenChange={setRemoveDeviceDialog}
        onConfirm={handleRemoveDeviceFromRack}
        title="Remove Device"
        description={`Are you sure you want to remove ${device.name} from this rack?`}
        confirmText="Remove"
        cancelText="Cancel"
      />

      <MoveToRackModal
        open={moveToRackDialog}
        onOpenChange={setMoveToRackDialog}
        deviceId={device.id}
      />
    </>
  );
};

export default SortableDevice;
