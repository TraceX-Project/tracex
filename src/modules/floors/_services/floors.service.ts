import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';

export const createFloor = async (buildingId: string, formData: FormData) => {
  const response = await request({
    method: 'POST',
    path: ENDPOINTS.buildings.createFloor(buildingId),
    body: formData,
  });

  return response;
};
