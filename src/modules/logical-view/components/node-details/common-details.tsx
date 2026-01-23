import { type LogicalDevice } from '../../_types/logical-view';

type Props = {
  device: LogicalDevice;
};

export const CommonDetails = ({ device }: Props) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Name</div>
          <div className="font-medium">{device.name}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Type</div>
          <div className="font-medium capitalize">
            {device.deviceTemplate.deviceType.replace('_', ' ')}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Model</div>
          <div className="font-medium">{device.deviceTemplate.modelName}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Vendor</div>
          <div className="font-medium capitalize">{device.deviceTemplate.vendor}</div>
        </div>
      </div>
    </div>
  );
};
