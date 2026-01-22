import { type LogicalDevice } from "../../_types/logical-view";
import { CommonDetails } from "./common-details";

type Props = {
  device: LogicalDevice;
};

export const VirtualMachineDetails = ({ device }: Props) => {
  return (
    <div className="space-y-6">
      <CommonDetails device={device} />

      <div className="rounded-md border p-4 bg-muted/20">
        <h3 className="mb-2 font-medium">Virtual Machine Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground">Status: <span className="text-green-600 font-medium">Running</span></div>
          {/* VM specific info */}
        </div>
      </div>
    </div>
  );
};
