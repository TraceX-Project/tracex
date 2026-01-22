import { type LogicalDevice } from "../../_types/logical-view";
import { CommonDetails } from "./common-details";

type Props = {
  device: LogicalDevice;
};

export const RouterDetails = ({ device }: Props) => {
  return (
    <div className="space-y-6">
      <CommonDetails device={device} />

      <div className="rounded-md border p-4">
        <h3 className="mb-2 font-medium">Routing Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Interfaces Used:</span>
            <span>{device.deviceInterfaces.filter(i => i.isConnected).length} / {device.deviceInterfaces.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
