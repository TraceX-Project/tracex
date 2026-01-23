import {
  type DeviceTemplate,
  type Vendor,
} from '@/modules/admin/device-templates/_types/device-template';

export type Server = {
  id: string;
  name: string;
  vendor: Vendor;
  projectId: string;
  apiUrl: string;
  x: number | null;
  y: number | null;
  deviceTemplateId: string;
  rackId: string | null;
  createdAt: string;
  updatedAt: string;
  deviceTemplate: DeviceTemplate;
};
