import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { createPorts } from '../_services/device-templates.service';

export const useCreatePorts = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (file: File[]) => {
      const formData = new FormData();
      formData.append('file', file[0]);
      return createPorts(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ports] });
    },
  });
};
