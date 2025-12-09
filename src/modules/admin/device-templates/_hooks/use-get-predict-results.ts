import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getPredictResults } from '../_services/device-templates.service';

export const useGetPredictResults = (taskId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.task, taskId, QUERY_KEYS.ports],
    queryFn: () => getPredictResults(taskId),
    enabled: !!taskId,
  });
};
