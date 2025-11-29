import { useMutation } from '@tanstack/react-query';
import { reorderFloors } from '../../buildings/_services/buildings.service';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { type Floor } from '@/modules/floors/_types/floor';

export const useReorderFloors = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      buildingId,
      floors,
    }: {
      buildingId: string;
      floors: Pick<Floor, 'id' | 'sortOrder'>[];
    }) => reorderFloors(buildingId, floors),
    onSuccess: (_, { buildingId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.buildings, buildingId],
      });
    },
  });
};
