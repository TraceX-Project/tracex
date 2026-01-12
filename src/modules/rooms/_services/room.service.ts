import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { Rack } from '../_types/room';
import { AddDeviceInput, CreateRackInput } from '../_schema/schema';
import { Device } from '../_types/room';

export const getRacks = async (roomId: string) => {
  const response = await request<Rack[]>({
    method: 'GET',
    path: ENDPOINTS.rooms.getRacks(roomId),
  });
  return response;
};

export const createRack = async (roomId: string, body: CreateRackInput) => {
  const response = await request<Rack>({
    method: 'POST',
    path: ENDPOINTS.rooms.createRack(roomId),
    body,
  });
  return response;
};

export const addDevice = async (body: AddDeviceInput) => {
  const response = await request<Rack>({
    method: 'POST',
    path: ENDPOINTS.rooms.addDevice(body.devices[0]),
    body,
  });
  return response;
};

export const getDevicesInProject = async (projectId: string) => {
  const response = await request<Device[]>({
    method: 'GET',
    path: ENDPOINTS.devices.getDevicesInProject(projectId),
  });
  return response;
};
