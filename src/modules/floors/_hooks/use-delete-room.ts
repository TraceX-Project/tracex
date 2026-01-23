import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { useMutation } from '@tanstack/react-query';
import { deleteRoom } from '../_services/rooms.service';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useDeleteRoom = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.rooms, data.floorId],
      });
    },
  });
};
