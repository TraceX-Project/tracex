import { request } from '@/shared/lib/api';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { type Server } from '../_types/server';

export const syncVms = async (serverId: string) => {
  const response = await request({
    method: 'POST',
    path: ENDPOINTS.servers.syncVms(serverId),
  });

  return response;
};

export const getServerById = async (serverId: string) => {
  const response = await request<Server>({
    method: 'GET',
    path: ENDPOINTS.servers.getById(serverId),
  });

  return response;
};
