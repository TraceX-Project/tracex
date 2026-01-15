import { type DeviceTemplate, type DeviceType } from '@/modules/admin/device-templates/_types/device-template';
import type z from 'zod';
import { type connectHypervisorSchema } from '../_schema/schema';

export type Topology = {
  nodes: Node[];
  edges: Edge[];
};

export enum HypervisorVendor {
  ESXI = 'esxi',
  PROXMOX = 'proxmox',
}

export type Position = {
  x: number;
  y: number;
};

export type Node = {
  id: string;
  name: string;
  position: Position;
  type: DeviceType;
};

export type Edge = {
  source: string;
  target: string;
};

export type Device = {
  id: string;
  name: string;
  projectId: string;
  sortOrder: number;
  rackId: string;
  deviceTemplateId: string;
  deviceStackId: string;
  stackMemberNumber: number;
  createdAt: string;
  updatedAt: string;
};

export type NodeContextMenuState = {
  id: string;
  x: number;
  y: number;
  type: DeviceType;
};

export type LogicalDevice = {
  id: string;
  name: string;
  projectId: string;
  sortOrder?: number;
  rackId?: string;
  deviceTemplateId: string;
  deviceStackId?: string;
  stackMemberNumber?: number;
  createdAt: string;
  updatedAt: string;
  deviceTemplate: DeviceTemplate;
  deviceInterfaces: DeviceInterface[];
}

export type DeviceInterface = {
  "id": string,
  "name": string,
  "portId": string,
  "ipAddress": string,
  "switchPortMode": string,
  "description": string,
  "deviceId": string,
  "stackMemberNumber": number,
  "createdAt": string,
  "updatedAt": string,
  "isConnected": boolean
}

export type CreateServerRequest = z.infer<typeof connectHypervisorSchema>