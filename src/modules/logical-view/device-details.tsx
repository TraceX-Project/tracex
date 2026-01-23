import { type Device } from './_types/logical-view';
import { DeviceInterfacesTable } from './device-interfaces-table';
import { DeviceVlansTable } from './device-vlans-table';
import { DeviceFrontPanel } from './device-front-panel';

export type Props = {
  device: Device;
};

const DeviceDetails = ({ device }: Props) => {
  return (
    <div className="space-y-4">
      <DeviceInterfacesTable interfaces={device.deviceInterfaces} />

      {device.deviceVlans.length > 0 && <DeviceVlansTable vlans={device.deviceVlans} />}

      <DeviceFrontPanel src={device.deviceTemplate.frontPanelUrl} alt={device.name} />
    </div>
  );
};

export default DeviceDetails;
