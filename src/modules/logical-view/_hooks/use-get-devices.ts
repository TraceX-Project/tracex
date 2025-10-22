import { useQuery } from '@tanstack/react-query';
import { getDevicesInProject } from '../_services/logical-view.service';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useGetDevicesInProject = (projectId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.projects, projectId, QUERY_KEYS.devices],
    queryFn: () => getDevicesInProject(projectId),
    enabled: false,
  });
};
