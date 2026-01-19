import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { Device, getRacksResponse, Message, type Rack } from '../_types/room';
import { type AddDeviceInput, type CreateRackInput } from '../_schema/schema';

export const getRacks = async (roomId: string) => {
  const response = await request<getRacksResponse[]>({
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

export const addDevicesToRack = async (rackId:string, body: AddDeviceInput) => {
  const response = await request<Message>({
    method: 'POST',
    path: ENDPOINTS.racks.addDeviceToRack(rackId),
    body,
  });
  return response;
};

export const getDevicesInProject = async (projectId: string) => {
  const response = await request<Device[]>({
    method: 'GET',
    path: ENDPOINTS.projects.getDevicesByProjectId(projectId),
  });
  return response;
};
