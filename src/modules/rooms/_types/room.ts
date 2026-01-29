

import { type Device } from '@/modules/logical-view/_types/logical-view';

export type Room = {
  id: string;
  x: number;
  y: number;
  name: string;
  floorId: string;
};

export type RackDevice = Omit<Device, 'deviceInterfaces'> & {
  deviceInterfaces: {
    id: string;
    name: string;
    x: number
    y: number;
    width: number;
    height: number;
    connectedInterface: RackDeviceConnectedInterface
  }[]
}

export type RackDeviceConnectedInterface = {
  id: string;
  name: string;
  deviceName: string;
  deviceId: string
}

export type Rack = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  roomId: string;
  unitSize: number;
  devices: RackDevice[]
};

export type CreateRackRequest = {
  name: string;
  unitSize: number;
};

export type DeviceInterface = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: string;
};


export type DEVICE_OPTIONS = {
  value: string;
  label: string;
};

export const DEVICE_OPTIONS = [
  { value: 'test', label: 'Cisco Switch' },
  { value: 'test2', label: 'Dell Router' },
];

export type GetDevicesInProjectParams = {
  inRack?: boolean;
};