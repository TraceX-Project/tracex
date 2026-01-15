import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { GetDeviceTemplatesParams, type DevicePorts } from '../_types/device-template';
import { type DeviceTemplate, type UpdateDeviceTemplateRequest } from '../_types/device-template';
import { buildQueryString } from '@/shared/utils/query';

export const createDeviceTemplate = async (formData: FormData) => {
  const response = await request<DeviceTemplate>({
    method: 'POST',
    path: ENDPOINTS.deviceTemplates.create,
    body: formData,
  });

  return response;
};

export const getDeviceTemplates = async (params?: GetDeviceTemplatesParams) => {
  const query = buildQueryString({
    type: params?.type
  })

  const response = await request<DeviceTemplate[]>({
    method: 'GET',
    path: `${ENDPOINTS.deviceTemplates.getAll}${query}`,
  });

  return response;
};

export const getDeviceTemplate = async (id: string) => {
  const response = await request<DeviceTemplate>({
    method: 'GET',
    path: ENDPOINTS.deviceTemplates.getById(id),
  });

  return response;
};

export const deleteDeviceTemplate = async (id: string) => {
  const response = await request<void>({
    method: 'DELETE',
    path: ENDPOINTS.deviceTemplates.delete(id),
  });

  return response;
};

export const updateDeviceTemplate = async (id: string, payload: UpdateDeviceTemplateRequest) => {
  const response = await request<DeviceTemplate>({
    method: 'PATCH',
    path: ENDPOINTS.deviceTemplates.update(id),
    body: payload,
  });

  return response;
};

export const predictPorts = async (formData: FormData) => {
  const response = await request<{ taskId: string; status: string }>({
    method: 'POST',
    path: ENDPOINTS.ports.predict,
    body: formData,
  });

  return response;
};

export const getPredictResults = async (taskId: string) => {
  const response = await request<DevicePorts>({
    method: 'GET',
    path: ENDPOINTS.ports.result(taskId),
  });

  return response;
};
