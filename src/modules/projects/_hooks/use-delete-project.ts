import { useMutation } from '@tanstack/react-query';
import { deleteProject } from '../_services/projects.service';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';

export const useDeleteProject = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });
};
