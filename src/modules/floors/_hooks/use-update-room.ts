import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { useMutation } from '@tanstack/react-query';
import { updateRoom } from '../_services/rooms.service';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { type UpdateRoomInput } from '@/modules/rooms/_schema/schema';
import { type Room } from '@/modules/rooms/_types/room';

export const useUpdateRoom = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      floorId,
      payload,
    }: {
      roomId: string;
      floorId: string;
      payload: UpdateRoomInput;
    }) => updateRoom(roomId, payload),
    onMutate: async ({ roomId, floorId, payload }) => {
      await Promise.all([queryClient.cancelQueries({ queryKey: [QUERY_KEYS.rooms, roomId] })]);

      const prevRoomList = queryClient.getQueryData<Room[]>([QUERY_KEYS.rooms, floorId]);

      if (prevRoomList) {
        queryClient.setQueryData<Room[]>(
          [QUERY_KEYS.rooms, floorId],
          prevRoomList.map((room) => (room.id === roomId ? { ...room, ...payload } : room))
        );
      }

      return { prevRoomList };
    },
    onError: (err, vars, context) => {
      if (context?.prevRoomList) {
        queryClient.setQueryData<Room[]>([QUERY_KEYS.rooms, vars.floorId], context.prevRoomList);
      }
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.rooms, data.floorId],
        });
      }
    },
  });
};
