import { type Room } from '@/modules/rooms/_types/room';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { type UpdateRoomInput } from '@/modules/rooms/_schema/schema';

export const deleteRoom = async (roomId: string) => {
  const response = await request<Room>({
    method: 'DELETE',
    path: ENDPOINTS.rooms.deleteById(roomId),
  });

  return response;
};

export const updateRoom = async (roomId: string, payload: UpdateRoomInput) => {
  const response = await request<Room>({
    method: 'PUT',
    path: ENDPOINTS.rooms.update(roomId),
    body: payload,
  });

  return response;
};
