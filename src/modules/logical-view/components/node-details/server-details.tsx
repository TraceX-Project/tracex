import { LogicalDevice } from "../../_types/logical-view";
import { CommonDetails } from "./common-details";

type Props = {
  device: LogicalDevice;
};

export const ServerDetails = ({ device }: Props) => {
  return (
    <div className="space-y-6">
      <CommonDetails device={device} />

      <div className="rounded-md border p-4">
        <h3 className="mb-2 font-medium">Server Configuration</h3>
        <div className="space-y-2 text-sm">
          {/* Placeholder for server specific data like CPU, RAM, etc if available in future */}
          <div className="text-muted-foreground">Interfaces: {device.deviceInterfaces.length}</div>
        </div>
      </div>
    </div>
  );
};
