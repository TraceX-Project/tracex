import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { useMutation } from '@tanstack/react-query';
import { CreateRackInput } from '../_schema/schema';
import { updateRack } from '../_services/room.service';

export const useUpdateRack = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      rackId,
      roomId,
      body,
    }: {
      rackId: string;
      roomId: string;
      body: CreateRackInput;
    }) => updateRack(rackId, body),
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.racks, roomId] });
    },
  });
};
