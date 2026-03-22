type Device = { id: string; deviceInterfaces: { id: string }[] };
type PortRow = { deviceId: string; portIds: string[] };

export function groupPortIdsByDevice(devices: Device[], portIds: string[]): PortRow[] {
  const interfaceToDeviceMap = new Map<string, string>();
  devices.forEach((d) => {
    d.deviceInterfaces.forEach((i) => interfaceToDeviceMap.set(i.id, d.id));
  });

  const portIdsByDevice = new Map<string, string[]>();
  portIds.forEach((portId) => {
    const devId = interfaceToDeviceMap.get(portId);
    if (devId) {
      const existing = portIdsByDevice.get(devId) ?? [];
      existing.push(portId);
      portIdsByDevice.set(devId, existing);
    }
  });

  const rows: PortRow[] = [];
  portIdsByDevice.forEach((pIds, devId) => {
    rows.push({ deviceId: devId, portIds: pIds });
  });

  return rows;
}
