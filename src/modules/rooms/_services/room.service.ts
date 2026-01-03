import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { Rack } from '../_types/room';
import { CreateRackInput } from '../_schema/schema';

export const getRacks = async (roomId: string) => {
    const response = await request<Rack[]>({
        method: 'GET',
        path: ENDPOINTS.rooms.getRacks(roomId),
    });
    return response;
};

export const createRack = async (body: CreateRackInput) => {
    const response = await request<Rack>({
        method: 'POST',
        path: ENDPOINTS.rooms.getRacks(body.roomId),
        body,
    });
    return response;
}
