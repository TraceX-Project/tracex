import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { type Floor } from '../_types/floor';

export const createFloor = async (buildingId: string, formData: FormData) => {
  const response = await request<Floor>({
    method: 'POST',
    path: ENDPOINTS.buildings.createFloor(buildingId),
    body: formData,
  });

  return response;
};

export const getFloor = async (floorId: string) => {
  const response = await request<Floor>({
    method: 'GET',
    path: ENDPOINTS.floors.getById(floorId),
  });

  return response;
};
