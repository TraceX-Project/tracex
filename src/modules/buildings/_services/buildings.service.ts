import { request } from '@/shared/lib/api';
import { Building, CreateBuildingRequest } from '../_types/buildings';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { Floor } from '@/modules/floors/_types/floor';

export const createBuilding = async (projectId: string, payload: CreateBuildingRequest) => {
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
  const response = await request<Building>({
    method: 'GET',
    path: ENDPOINTS.buildings.getById(id),
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
