import { useMutation } from '@tanstack/react-query';
import { updateProject } from '../_services/projects.service';
import { type UpdateProjectRequest } from '../_types/projects';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useUpdateProject = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectRequest }) =>
      updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });
};
