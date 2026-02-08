import {
  type DeviceTemplate,
} from '@/modules/admin/device-templates/_types/device-template';
import { type Project } from '@/modules/projects/_types/projects';
import { type HypervisorVendor } from './logical-view';

export type ServerConnection = {
  id: string;
  projectId: string;
  serverId: string;
  deviceInterfaceId: string;
  createdAt: string;
  updatedAt: string;
};

export type Server = {
  id: string;
  name: string;
  vendor: HypervisorVendor;
  projectId: string;
  apiUrl: string;
  x: number | null;
  y: number | null;
  deviceTemplateId: string;
  rackId: string | null;
  createdAt: string;
  updatedAt: string;
  deviceTemplate: DeviceTemplate;
  project: Project;
  serverConnections: ServerConnection[];
};
