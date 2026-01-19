import {
  type CreateProjectRequest,
  type Project,
  type UpdateProjectRequest,
} from '../_types/projects';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';

export const createProject = async (payload: CreateProjectRequest) => {
  const response = await request<Project>({
    method: 'POST',
    path: ENDPOINTS.projects.create,
    body: payload,
  });

  return response;
};

export const getProjects = async () => {
  const response = await request<Project[]>({
    method: 'GET',
    path: ENDPOINTS.projects.getAll,
  });

  return response;
};

export const deleteProject = async (projectId: string) => {
  const response = await request<void>({
    method: 'DELETE',
    path: `${ENDPOINTS.projects.delete(projectId)}`,
  });

  return response;
};

export const getProjectById = async (projectId: string) => {
  const response = await request<Project>({
    method: 'GET',
    path: `${ENDPOINTS.projects.getById(projectId)}`,
  });

  return response;
};

export const updateProject = async (projectId: string, payload: UpdateProjectRequest) => {
  const response = await request<Project>({
    method: 'PATCH',
    path: ENDPOINTS.projects.update(projectId),
    body: payload,
  });

  return response;
};

export const updateThumbnail = async (projectId: string, body: FormData) => {
  const response = await request<Project>({
    method: 'PATCH',
    path: ENDPOINTS.projects.thumbnail(projectId),
    body,
  });

  return response;
};
