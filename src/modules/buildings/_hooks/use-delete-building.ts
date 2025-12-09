import { useMutation } from '@tanstack/react-query';
import { deleteBuilding } from '../_services/buildings.service';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useDeleteBuilding = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBuilding(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.projects, data.projectId, QUERY_KEYS.buildings],
      });
    },
  });
};
