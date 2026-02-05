import { request } from '@/shared/lib/api';
import {
  type LogicalDevice,
  type CreateServerRequest,
  type GetLogicalDeviceResponse,
  Position,
} from '../_types/logical-view';
import { ENDPOINTS } from '@/shared/config/endpoints';

export const getLogicalDevices = async (projectId: string) => {
  const response = await request<LogicalDevice[]>({
    method: 'GET',
    path: ENDPOINTS.projects.logicalDevices(projectId),
  });

  return response;
};

export const createServer = async (projectId: string, data: CreateServerRequest) => {
  const response = await request({
    method: 'POST',
    path: ENDPOINTS.projects.createServer(projectId),
    body: data,
  });

  return response;
};

export const deleteLogicalDevices = async (id: string) => {
  const response = await request({
    method: 'DELETE',
    path: ENDPOINTS.logicalDevices.delete(id),
  });

  return response;
};

export const getLogicalDeviceById = async (id: string): Promise<GetLogicalDeviceResponse> => {
  const response = await request<GetLogicalDeviceResponse>({
    method: 'GET',
    path: ENDPOINTS.logicalDevices.getById(id),
  });

  return response;
};

export const updateDevicePosition = async (id: string, position: Position) => {
  const response = await request({
    method: 'PATCH',
    path: ENDPOINTS.logicalDevices.updatePosition(id),
    body: position,
  });

  return response;
}