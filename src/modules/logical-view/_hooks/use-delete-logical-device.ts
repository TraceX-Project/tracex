import { useMutation } from '@tanstack/react-query';
import { deleteLogicalDevices } from '../_services/devices.service';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';

export const useDeleteLogicalDevice = (projectId: string) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLogicalDevices(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topology, projectId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.logicalDevices, projectId] });
    },
  });
};
