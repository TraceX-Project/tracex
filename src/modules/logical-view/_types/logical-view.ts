import { type DeviceType } from '@/modules/admin/device-templates/_types/device-template';

export type Topology = {
  nodes: Node[];
  edges: Edge[];
};

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
};
