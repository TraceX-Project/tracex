import {
  type CreateProjectRequest,
  type Project,
  type UpdateProjectRequest,
} from '../_types/projects';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { ApiError } from '@/shared/lib/api-error';

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

export const getProject = async (projectId: string) => {
  try {
    const response = await request<Project>({
      method: 'GET',
      path: `${ENDPOINTS.projects.getById(projectId)}`,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const updateProject = async (projectId: string, payload: UpdateProjectRequest) => {
  const response = await request<Project>({
    method: 'PATCH',
    path: `${ENDPOINTS.projects.update(projectId)}`,
    body: payload,
  });

  return response;
};
