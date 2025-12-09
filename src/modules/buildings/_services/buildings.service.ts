import { request } from '@/shared/lib/api';
import { type Building } from '../_types/buildings';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { type Floor } from '@/modules/floors/_types/floor';
import { type CreateBuildingSchema, type UpdateBuildingSchema } from '../_schema/building';

export const createBuilding = async (projectId: string, payload: CreateBuildingSchema) => {
  const response = await request<Building>({
    method: 'POST',
    path: ENDPOINTS.projects.createBuilding(projectId),
    body: payload,
  });

  return response;
};

export const getBuildings = async (projectId: string) => {
  const response = await request<Building[]>({
    method: 'GET',
    path: ENDPOINTS.projects.getBuildings(projectId),
  });

  return response;
};

export const getBuildingById = async (id: string) => {
  try {
    const response = await request<Building>({
      method: 'GET',
      path: ENDPOINTS.buildings.getById(id),
    });

    return response;
  } catch {
    return null;
  }
};

export const deleteBuilding = async (id: string) => {
  const response = await request<Building>({
    method: 'DELETE',
    path: ENDPOINTS.buildings.delete(id),
  });

  return response;
};

export const reorderFloors = async (
  buildingId: string,
  floors: Pick<Floor, 'id' | 'sortOrder'>[]
) => {
  const response = await request<Building>({
    method: 'PUT',
    path: ENDPOINTS.buildings.reorderFloors(buildingId),
    body: { floors },
  });

  return response;
};

export const updateBuilding = async (id: string, payload: Partial<UpdateBuildingSchema>) => {
  const response = await request<Building>({
    method: 'PUT',
    path: ENDPOINTS.buildings.update(id),
    body: payload,
  });

  return response;
};
