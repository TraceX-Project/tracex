import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { useMutation } from '@tanstack/react-query';
import { type AddDeviceRequest } from '../_types/room';
import { addDevicesToRack } from '../_services/room.service';

export const useAddDevicesToRack = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({ rackId, data }: { rackId: string; data: AddDeviceRequest }) =>
      addDevicesToRack(rackId, data),
    onSuccess: ({ roomId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.rooms, roomId] });
    },
  });
};
