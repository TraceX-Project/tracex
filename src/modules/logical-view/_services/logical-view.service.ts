import { ENDPOINTS } from '@/shared/config/endpoints';

import { request } from '@/shared/lib/api';

import { type DevicesResponse } from '../_types/logical-view';

export const getDevicesInProject = async (projectId: string) => {
  const response = await request<DevicesResponse>({
    method: 'GET',
    path: ENDPOINTS.devices.getDevicesInProject(projectId),
  });
  return response;
};
