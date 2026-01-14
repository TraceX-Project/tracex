
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
};

const NodeDetailsSheet = ({ open, onOpenChange, deviceId }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Node Details</SheetTitle>
          <SheetDescription>
            View detailed information about this device.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <div className="text-sm text-muted-foreground">
            Details for device ID: <span className="font-mono text-foreground">{deviceId}</span>
          </div>
          {/* Table will go here */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeDetailsSheet;
