import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { DevicePorts } from '../_types/device-template';
import {
  type CreateDeviceTemplateRequest,
  type DeviceTemplate,
  type UpdateDeviceTemplateRequest,
} from '../_types/device-template';

export const createDeviceTemplate = async (payload: CreateDeviceTemplateRequest) => {
  console.log("endpoints", ENDPOINTS.deviceTemplates.create);
  console.log("payload",payload);
  const response = await request<DeviceTemplate>({
    method: 'POST',
    path: ENDPOINTS.deviceTemplates.create,
    body: payload,
  });
  return response;
};

export const getDeviceTemplates = async () => {
  const response = await request<DeviceTemplate[]>({
    method: 'GET',
    path: ENDPOINTS.deviceTemplates.getAll,
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

export const createPorts = async (formData: FormData) => {
  const response = await request<{ taskId: string; status: string }>({
    method: 'POST',
    path: ENDPOINTS.ports.createPorts,
    body: formData,
  });
  return response;
};

export const getPorts = async (taskId: string) => {
  const response = await request<DevicePorts>({
    method: 'GET',
    path: ENDPOINTS.ports.getPortsInDevice(taskId),
  });
  return response;
};
