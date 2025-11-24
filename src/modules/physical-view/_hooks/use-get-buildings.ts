import { useQuery } from '@tanstack/react-query';
import { getBuildings } from '../_services/buildings.service';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useGetBuildings = (projectId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.projects, projectId, QUERY_KEYS.buildings],
    queryFn: () => getBuildings(projectId),
    enabled: !!projectId,
  });
