import { useMutation } from '@tanstack/react-query';
import { createFloor } from '../_services/floors.service';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const useCreateFloor = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({ buildingId, data }: { buildingId: string; data: FormData }) =>
      createFloor(buildingId, data),
    onSuccess: (_, { buildingId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.buildings, buildingId],
      });
    },
  });
};
