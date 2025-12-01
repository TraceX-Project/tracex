import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getRooms } from '../_services/floors.service';

export const useGetRooms = (floorId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.rooms, floorId],
    queryFn: () => getRooms(floorId),
    enabled: !!floorId,
  });
