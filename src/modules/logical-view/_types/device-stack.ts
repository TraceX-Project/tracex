import { type Project } from '@/modules/projects/_types/projects';
import { type Device } from './logical-view';

export type DeviceStack = {
  id: string;
  name: string;
  x: number | null;
  y: number | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  project: Project;
  devices: Device[];
};
