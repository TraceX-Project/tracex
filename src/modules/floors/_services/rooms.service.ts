import { type Rack, type Room } from '@/modules/rooms/_types/room';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { type UpdateRoomInput } from '@/modules/rooms/_schema/schema';
import { type MessageResponse } from '@/shared/types/response';

export const deleteRoom = async (roomId: string) => {
  const response = await request<Room>({
    method: 'DELETE',
    path: ENDPOINTS.rooms.deleteById(roomId),
  });

  return response;
};

export const updateRoom = async (roomId: string, payload: UpdateRoomInput) => {
  const response = await request<Room>({
    method: 'PATCH',
    path: ENDPOINTS.rooms.update(roomId),
    body: payload,
  });

  return response;
};

export const reorderRacks = async (roomId: string, racks: Pick<Rack, 'id' | 'sortOrder'>[]) => {
  const response = await request<MessageResponse>({
    method: 'PATCH',
    path: ENDPOINTS.rooms.reorderRacks(roomId),
    body: { racks },
  });

  return response;
}
