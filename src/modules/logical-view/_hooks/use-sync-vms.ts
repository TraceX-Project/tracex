
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { syncVms } from '../_services/servers.service';

export const useSyncVms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serverId }: { serverId: string }) =>
      syncVms(serverId),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.logicalDevices, serverId],
      });
    },
  });
};
