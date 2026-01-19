import { useQuery, useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { createFloor, getFloorById, getFloors } from '../_services/floors.service';

export const useCreateFloor = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({ buildingId, data }: { buildingId: string; data: FormData }) =>
      createFloor(buildingId, data),
    onSuccess: (_, { buildingId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.buildings, buildingId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.floors, buildingId],
      });
    },
  });
};

export const useGetFloorById = (floorId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.floors, floorId],
    queryFn: () => getFloorById(floorId),
    enabled: !!floorId,
  });

export const useGetFloors = (buildingId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.floors, buildingId],
    queryFn: () => getFloors(buildingId),
    enabled: !!buildingId,
    retry: false,
  });
