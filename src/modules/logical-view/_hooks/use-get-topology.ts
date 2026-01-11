import { useQuery } from '@tanstack/react-query';
import { getTopology } from '../_services/logical-view.service';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useGetTopology = (projectId: string) =>
  useQuery({
    queryFn: () => getTopology(projectId),
    queryKey: [QUERY_KEYS.topology, projectId],
    enabled: !!projectId,
  });
