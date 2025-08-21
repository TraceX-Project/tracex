import { type Edge } from '@xyflow/react';
import { Routernode, Switchnode } from '../components/index';

export const nodeTypes = {
  Router: Routernode,
  Switch: Switchnode,
};

export type InterfaceInfo = {
  name: string;
  ip: string;
  netmask: string;
  description: string;
};

export type DeviceNode = {
  hostname: string;
  interface: InterfaceInfo[];
  location: {
    x: number;
    y: number;
  };
  category: string;
};

export type DeviceEdge = {
  from: string;
  to: string;
};

export type DeviceInfo = {
  nodes: DeviceNode[];
  edges?: DeviceEdge[];
};

export type NodeType = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  type: string;
  data: {
    label: string;
    data: DeviceNode;
  };
};

export type EdgeType = Edge;

export const nodeWidth = 172;
export const nodeHeight = 36;
