import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getDevicesInProject } from '../_services/room.service';

export const useGetDevicesInProject = (projectId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.devices, projectId],
    queryFn: () => getDevicesInProject(projectId),
    enabled: !!projectId,
    retry: false,
  });
