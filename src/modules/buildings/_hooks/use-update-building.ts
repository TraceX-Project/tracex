import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { type UpdateBuildingSchema } from '../_schema/building';
import { updateBuilding } from '../_services/buildings.service';
import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useUpdateBuilding = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBuildingSchema }) =>
      updateBuilding(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.projects, data.projectId, QUERY_KEYS.buildings],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.buildings, data.id],
      });
    },
  });
};
