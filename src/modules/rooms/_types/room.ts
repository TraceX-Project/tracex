import { type Alignment, type DeviceType, type Vendor } from "@/modules/admin/device-templates/_types/device-template";
import { type Device } from "@/modules/logical-view/_types/logical-view";

export type Room = {
  id: string;
  x: number;
  y: number;
  name: string;
  floorId: string;
};

export type Rack = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  roomId: string;
  unitSize: number;
};

export type CreateRackRequest = {
  name: string;
  unitSize: number;
};

export type Message = {
  message: string
}

export type DeviceInterface = {
  id: string,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  status: string,
}

export type DevicePort = {
  id: string,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  portNumber: number;
}

export type deviceTemplate = {
  id: string,
  modelName: string,
  vendor: Vendor,
  deviceType: DeviceType,
  unitSize: number,
  frontPanelUrl: string,
  alignment: Alignment
}

export type DEVICE_OPTIONS = {
  value: string;
  label: string;
}


export type getRacksResponse = {
  id: string;
  roomId: string;
  name: string;
  unitSize: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  devices: Device[];
}


export const DEVICE_OPTIONS = [
  { value: 'test', label: 'Cisco Switch' },
  { value: 'test2', label: 'Dell Router' },
];

export type AddDeviceRequest = {
  deviceIds: string[];
};
