import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { deleteDeviceTemplate } from '../_services/devices.service';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useMutation } from '@tanstack/react-query';

export const useDeleteDeviceTemplate = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDeviceTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.deviceTemplates] });
    },
  });
};
