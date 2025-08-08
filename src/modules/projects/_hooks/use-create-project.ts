import { QueryClient, useMutation } from '@tanstack/react-query';
import { createProject } from '../_services/projects.service';
import { QUERY_KEYS } from '../_config/config';
import { CreateProjectRequest } from '../_types/projects';

export const useCreateProject = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
    },
  });
};
