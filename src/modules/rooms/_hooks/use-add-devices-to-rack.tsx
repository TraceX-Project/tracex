import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { useMutation } from '@tanstack/react-query';
import { addDevicesToRack } from '../_services/room.service';
import { AddDevicesToRackRequest } from '../_schema/schema';

export const useAddDevicesToRack = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({
      rackId,
      roomId,
      data,
    }: {
      rackId: string;
      roomId: string;
      data: AddDevicesToRackRequest;
    }) => addDevicesToRack(rackId, data),
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.racks, roomId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.physicalDevices] })
    },
  });
};
