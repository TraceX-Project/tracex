import { useMutation } from '@tanstack/react-query';
import { createProject } from '../_services/projects.service';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { type CreateProjectRequest } from '../_types/projects';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';

export const useCreateProject = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });
};
