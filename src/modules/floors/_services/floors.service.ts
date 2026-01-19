import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { type Floor } from '../_types/floor';
import { type CreateRoomInput } from '@/modules/rooms/_schema/schema';
import { type Room } from '@/modules/rooms/_types/room';

export const createFloor = async (buildingId: string, formData: FormData) => {
  const response = await request<Floor>({
    method: 'POST',
    path: ENDPOINTS.buildings.createFloor(buildingId),
    body: formData,
  });

  return response;
};

export const getFloorById = async (floorId: string) => {
  const response = await request<Floor>({
    method: 'GET',
    path: ENDPOINTS.floors.getById(floorId),
  });

  return response;
};

export const getFloors = async (buildingId: string) => {
  const response = await request<Floor[]>({
    method: 'GET',
    path: ENDPOINTS.buildings.getFloors(buildingId),
  });

  return response;
};

export const createRoom = async (floorId: string, body: CreateRoomInput) => {
  const response = await request<Room>({
    method: 'POST',
    path: ENDPOINTS.floors.createRoom(floorId),
    body,
  });

  return response;
};

export const getRooms = async (floorId: string) => {
  const response = await request<Room[]>({
    method: 'GET',
    path: ENDPOINTS.floors.getRooms(floorId),
  });

  return response;
};
