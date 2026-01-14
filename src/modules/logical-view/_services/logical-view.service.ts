import { ENDPOINTS } from '@/shared/config/endpoints';

import { request } from '@/shared/lib/api';

import { type Device, type Topology } from '../_types/logical-view';

export const addDeviceToProject = async (projectId: string, formData: FormData) => {
  const response = await request<Device[]>({
    method: 'POST',
    path: ENDPOINTS.projects.upload(projectId),
    body: formData,
  });

  return response;
};

export const getTopology = async (projectId: string) => {
  const response = await request<Topology>({
    method: 'GET',
    path: ENDPOINTS.projects.topology(projectId),
  });

  return response;
};
