import { type DeviceType } from '@/modules/admin/device-templates/_types/device-template';

export type DevicesResponse = {
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
