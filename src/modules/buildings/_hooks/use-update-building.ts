import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { type UpdateBuildingSchema } from '../_schema/building';
import { updateBuilding } from '../_services/buildings.service';
import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { Building } from '../_types/buildings';

export const useUpdateBuilding = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
      projectId,
    }: {
      id: string;
      payload: UpdateBuildingSchema;
      projectId: string;
    }) => updateBuilding(id, payload),
    onMutate: async ({ id, payload, projectId }) => {
      console.log('onMutate called with:', { id, payload, projectId });

      await Promise.all([
        queryClient.cancelQueries({ queryKey: [QUERY_KEYS.buildings, id] }),
        queryClient.cancelQueries({
          queryKey: [QUERY_KEYS.projects, projectId, QUERY_KEYS.buildings],
        }),
      ]);

      const previousBuilding = queryClient.getQueryData<Building>([QUERY_KEYS.buildings, id]);
      const prevBuildingList = queryClient.getQueryData<Building[]>([
        QUERY_KEYS.projects,
        projectId,
        QUERY_KEYS.buildings,
      ]);

      if (previousBuilding) {
        queryClient.setQueryData<Building>([QUERY_KEYS.buildings, id], {
          ...previousBuilding,
          ...payload,
        });
      }

      if (prevBuildingList) {
        queryClient.setQueryData<Building[]>(
          [QUERY_KEYS.projects, projectId, QUERY_KEYS.buildings],
          prevBuildingList.map((b) => (b.id === id ? { ...b, ...payload } : b))
        );
      }

      return { previousBuilding, prevBuildingList };
    },
    onError: (err, vars, context) => {
      if (context?.previousBuilding) {
        queryClient.setQueryData<Building>(
          [QUERY_KEYS.buildings, context.previousBuilding.id],
          context.previousBuilding
        );
      }

      if (
        context?.previousBuilding &&
        context?.prevBuildingList &&
        context.previousBuilding.projectId
      ) {
        queryClient.setQueryData<Building[]>(
          [QUERY_KEYS.projects, context.previousBuilding.projectId, QUERY_KEYS.buildings],
          context.prevBuildingList
        );
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.buildings, data?.id] });

      if (data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.projects, data.projectId, QUERY_KEYS.buildings],
        });
      }
    },
  });
};
