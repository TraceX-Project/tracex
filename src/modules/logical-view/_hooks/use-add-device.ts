import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { addDeviceToProject } from '../_services/logical-view.service';

export const useAddDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, formData }: { projectId: string; formData: FormData }) =>
      addDeviceToProject(projectId, formData),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.topology, projectId] });
    },
  });
};
