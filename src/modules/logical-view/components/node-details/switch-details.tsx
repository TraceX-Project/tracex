import { type LogicalDevice } from "../../_types/logical-view";
import { CommonDetails } from "./common-details";

type Props = {
  device: LogicalDevice;
};

export const SwitchDetails = ({ device }: Props) => {
  return (
    <div className="space-y-6">
      <CommonDetails device={device} />

      <div className="rounded-md border p-4">
        <h3 className="mb-2 font-medium">Switch Ports</h3>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {device.deviceInterfaces.map((intf) => (
            <div key={intf.id} className={`h-8 w-8 rounded flex items-center justify-center text-xs border ${intf.isConnected ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200'}`} title={intf.name}>
              {intf.name.replace(/^(FastEthernet|GigabitEthernet|TenGigabitEthernet)/, '').substring(0, 2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
