import { Project } from "@/modules/projects/_types/projects";
import { Device, DeviceInterface } from "./logical-view";
import { DeviceTemplate } from "@/modules/admin/device-templates/_types/device-template";
import { DeviceVlan } from "./device-vlan";

export type DeviceStack = {
  id: string;
  name: string;
  x: number | null;
  y: number | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  project: Project
  devices: Device[]
}