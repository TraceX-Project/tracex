import { request } from '@/shared/lib/api';
import { Building, CreateBuildingRequest } from '../_types/buildings';
import { ENDPOINTS } from '@/shared/config/endpoints';

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
