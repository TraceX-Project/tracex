import {
  type DeviceTemplate,
  type DeviceType,
} from '@/modules/admin/device-templates/_types/device-template';
import type z from 'zod';
import { type connectHypervisorSchema } from '../_schema/schema';
import { type Server } from './server';
import { type VirtualMachine } from './virtual-machine';
import { type DeviceStack } from './device-stack';
import { type DeviceVlan } from './device-vlan';

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
  inRack: boolean;
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
  x: number | null;
  y: number | null;
  createdAt: string;
  updatedAt: string;
  type: string;
  uPosition: number;
  deviceInterfaces: DeviceInterface[];
  deviceTemplate: DeviceTemplate;
  deviceVlans: DeviceVlan[];
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
};

export type DeviceInterface = {
  id: string;
  name: string;
  portId: string;
  ipAddress: string;
  switchPortMode: string;
  description: string;
  deviceId: string;
  stackMemberNumber: number;
  createdAt: string;
  updatedAt: string;
  isConnected: boolean;
};

export type HypervisorNode = {
  externalId: string;
  name: string;
  status: string;
};

export type GetServerNodesRequest = {
  apiUrl: string;
  apiKey: string;
  vendor: HypervisorVendor;
};

export type CreateServerRequest = z.infer<typeof connectHypervisorSchema>;

export type GetLogicalDeviceResponse =
  | {
    id: string;
    type: DeviceType.SERVER;
    data: Server;
  }
  | {
    id: string;
    type: DeviceType.VIRTUAL_MACHINE;
    data: VirtualMachine;
  }
  | {
    id: string;
    type: DeviceType.SWITCH_STACK;
    data: DeviceStack;
  }
  | {
    id: string;
    type: DeviceType.ROUTER;
    data: Device;
  }
  | {
    id: string;
    type: DeviceType.SWITCH;
    data: Device;
  };

export type UpdateDevicePositionsRequest = {
  id: string;
  x: number;
  y: number;
}