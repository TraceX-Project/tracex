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
  SWITCH_STACK = 'switch_stack',
  SERVER = 'server'
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

export type UpdateDeviceTemplateRequest = Partial<CreateDeviceTemplateRequest>;

export type DeviceTemplateFormData = z.infer<typeof deviceTemplateSchema>;

export type PortRange = z.infer<typeof deviceTemplateSchema.shape.portRanges>[0];

export type BoundingBox = z.infer<typeof deviceTemplateSchema.shape.boundingBoxes>[0];

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

export type CreateDeviceTemplateRequest = {
  modelName: string;
  vendor: Vendor;
  deviceType: DeviceType;
  rows: number;
  columns: number;
  alignment: Alignment;
  frontPanel: File;
  unitSize: number;
  portRanges: Omit<PortRange, 'id'>[];
  boundingBoxes: BoundingBox[];
};
