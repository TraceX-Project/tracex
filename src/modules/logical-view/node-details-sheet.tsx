import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { useGetLogicalDevice } from './_hooks/use-get-logical-device';
import { DeviceType } from '../admin/device-templates/_types/device-template';
import { ServerDetails } from './server-details';
import { VirtualMachineDetails } from './virtual-machine-details';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
};

const NodeDetailsSheet = ({ open, onOpenChange, deviceId }: Props) => {
  const { data: device } = useGetLogicalDevice(deviceId);

  const renderContent = () => {
    if (!device) return null;

    switch (device.type) {
      case DeviceType.SERVER:
        return <ServerDetails device={device.data} />;
      case DeviceType.VIRTUAL_MACHINE:
        return <VirtualMachineDetails device={device.data} />;

      default:
        return <div>Common Details Component</div>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {device?.data.name ?? 'Details'}
          </SheetTitle>
          <SheetDescription>
            {device?.type === DeviceType.VIRTUAL_MACHINE && (
              <span className="flex items-center gap-1">
                Virtual Machine on {device.data.details?.node ?? 'Unknown Node'}
              </span>
            )}
            {device?.type === DeviceType.SERVER && (
              <span className="capitalize">{device.data.vendor} Server</span>
            )}
            {!device && 'View detailed information about this device.'}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          {renderContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeDetailsSheet;
