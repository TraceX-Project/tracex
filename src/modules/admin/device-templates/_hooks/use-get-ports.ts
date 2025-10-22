import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getPorts } from '../_services/device-templates.service';

export const useGetPorts = (taskId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.task, taskId, QUERY_KEYS.ports],
    queryFn: () => getPorts(taskId),
    enabled: !!taskId,
  });
};
