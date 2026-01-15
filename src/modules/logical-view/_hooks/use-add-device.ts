import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { addDeviceToProject } from '../_services/logical-view.service';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';

export const useAddDevice = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, formData }: { projectId: string; formData: FormData }) =>
      addDeviceToProject(projectId, formData),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topology, projectId] });
    },
  });
};
