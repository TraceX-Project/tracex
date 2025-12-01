import { useMutation } from '@tanstack/react-query';
import { createRoom } from '../_services/floors.service';
import { type CreateRoomInput } from '@/modules/rooms/_schema/schema';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useCreateRoom = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({ floorId, body }: { floorId: string; body: CreateRoomInput }) =>
      createRoom(floorId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.rooms] });
    },
  });
};
