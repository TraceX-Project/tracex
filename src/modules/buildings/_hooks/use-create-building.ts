import { useMutation } from '@tanstack/react-query';
import { type CreateBuildingRequest } from '../../buildings/_types/buildings';
import { createBuilding } from '../../buildings/_services/buildings.service';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useCreateBuilding = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: CreateBuildingRequest }) =>
      createBuilding(projectId, payload),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.projects, projectId, QUERY_KEYS.buildings],
      });
    },
  });
};
