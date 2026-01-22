import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { useGetLogicalDevice } from './_hooks/use-get-logical-device';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
};

const NodeDetailsSheet = ({ open, onOpenChange, deviceId }: Props) => {
  const { data: device } = useGetLogicalDevice(deviceId);

  // const renderContent = () => {
  //   if (!device) return null;

  //   switch (device.deviceTemplate.deviceType) {
  //     case DeviceType.SERVER:
  //       return <ServerDetails device={device} />;
  //     case DeviceType.VIRTUAL_MACHINE:
  //       return <VirtualMachineDetails device={device} />;
  //     case DeviceType.ROUTER:
  //       return <RouterDetails device={device} />;
  //     case DeviceType.SWITCH:
  //     case DeviceType.SWITCH_STACK:
  //       return <SwitchDetails device={device} />;
  //     default:
  //       return <CommonDetails device={device} />;
  //   }
  // };

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
          {JSON.stringify(device)}
          {/* Table will go here */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeDetailsSheet;
