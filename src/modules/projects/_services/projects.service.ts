import { CreateProjectRequest, Project } from '../_types/projects';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';

export const createProject = async (payload: CreateProjectRequest) => {
  const response = await request<Project>({
    method: 'POST',
    path: ENDPOINTS.projects.create,
    body: payload,
  });

  return response.data;
};

export const getProjects = async () => {
  const response = await request<Project[]>({
    method: 'GET',
    path: ENDPOINTS.projects.getAll,
  });

  return response;
};
