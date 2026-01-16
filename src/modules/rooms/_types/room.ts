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

export type Device = {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DEVICE_OPTIONS = {
  value: string;
  label: string;
}

export const DEVICE_OPTIONS = [
  { value: 'test', label: 'Cisco Switch' },
  { value: 'test2', label: 'Dell Router' },
];

export type AddDeviceRequest = {
  deviceIds: string[];
};
