import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getFloors } from '../_services/floors.service';

export const useGetFloors = (buildingId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.floors, buildingId],
    queryFn: () => getFloors(buildingId),
    enabled: !!buildingId,
  });
