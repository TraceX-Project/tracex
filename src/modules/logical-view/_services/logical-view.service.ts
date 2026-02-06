import { ENDPOINTS } from '@/shared/config/endpoints';

import { request } from '@/shared/lib/api';

import { UpdateDevicePositionsRequest, type Device, type Topology } from '../_types/logical-view';

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

export const updateLogicalDevicePositions = async (
  positions: UpdateDevicePositionsRequest[]
) => {
  const response = await request<void>({
    method: 'PATCH',
    path: ENDPOINTS.logicalDevices.updatePositions,
    body: {
      items: positions,
    },
  });

  return response;
};
