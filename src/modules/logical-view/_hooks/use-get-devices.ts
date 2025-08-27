import { useQuery } from '@tanstack/react-query';
import { getDevicesInProject } from '../_services/logical-view.service';

export const useGetDevicesInProject = (projectId: string) => {
  return useQuery({
    queryKey: ['devices', projectId],
    queryFn: () => getDevicesInProject(projectId),
  });
};
