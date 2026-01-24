import { request } from '@/shared/lib/api';
import { ENDPOINTS } from '@/shared/config/endpoints';

export const syncVms = async (serverId: string) => {
  const response = await request({
    method: 'POST',
    path: ENDPOINTS.servers.syncVms(serverId),
  });

  return response;
};
