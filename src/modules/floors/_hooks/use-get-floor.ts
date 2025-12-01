import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getFloor } from '../_services/floors.service';

export const useGetFloor = (floorId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.floors, floorId],
    queryFn: () => getFloor(floorId),
    enabled: !!floorId,
  });
