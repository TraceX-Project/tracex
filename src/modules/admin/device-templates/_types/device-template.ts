import { type deviceTemplateSchema } from '../_schema/schema';
import { type z } from 'zod';

export enum Vendor {
  CISCO = 'cisco',
  DELL = 'dell',
  MIKROTIK = 'mikrotik',
}

export enum DeviceType {
  ROUTER = 'router',
  SWITCH = 'switch',
}

export enum Alignment {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export enum PortType {
  FAST_ETHERNET = 'FastEthernet',
  GIGABIT_ETHERNET = 'GigabitEthernet',
  TEN_GIGABIT_ETHERNET = 'TenGigabitEthernet',
}

export type Port = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type DeviceTemplate = {
  id: string;
  modelName: string;
  vendor: Vendor;
  deviceType: DeviceType;
  unitSize: number;
  rows: number;
  columns: number;
  alignment: Alignment;
  frontPanelUrl: string;
  ports: Port[];
};

export type OutputImage = {
  url: string;
};

export type DevicePorts = {
  taskId: string;
  status: string;
  ports: Port[];
};
export type PortInput = {
  x: number;
  y: number;
  w: number;
  h: number;
};
export type boundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  portNumber: number;
}

export type portRange = {
  start: number;
  end: number;
  runningNumber: number;
  prefix: string;
  portType: PortType;
}
export type CreateDeviceTemplateRequest = {
  modelName: string;
  vendor: Vendor;
  deviceType: DeviceType;
  rows: number;
  columns: number;
  alignment: Alignment;
  frontPanel: File;
  unitSize: number;
  portRanges: portRange[];
  boundingBoxes: boundingBox[];
};

export type UpdateDeviceTemplateRequest = Partial<CreateDeviceTemplateRequest>;

export type DeviceTemplateFormData = z.infer<typeof deviceTemplateSchema>;

export type PortRange = z.infer<typeof deviceTemplateSchema.shape.portRanges>[0];
