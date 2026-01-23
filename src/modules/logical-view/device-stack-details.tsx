import { DeviceStack } from "./_types/device-stack";
import { DeviceInterfacesTable } from "./device-interfaces-table";
import { DeviceVlansTable } from "./device-vlans-table";
import { DeviceFrontPanel } from "./device-front-panel";

type Props = {
  device: DeviceStack
}

const DeviceStackDetails = ({ device }: Props) => {
  const interfaces = device.devices.flatMap((device) => device.deviceInterfaces);
  const vlans = Array.from(
    new Map(
      device.devices
        .flatMap(d => d.deviceVlans)
        .map(vlan => [vlan.id, vlan])
    ).values()
  );

  return <div className="space-y-4">
    <DeviceInterfacesTable interfaces={interfaces} />
    <DeviceVlansTable vlans={vlans} />

    <DeviceFrontPanel
      src={device.devices[0]?.deviceTemplate?.frontPanelUrl}
      alt={device.name}
    />
  </div>;
};

export default DeviceStackDetails;