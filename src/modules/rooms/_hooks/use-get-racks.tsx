import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getRacks } from '../_services/room.service';

export const useGetRacks = (roomId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.racks, roomId],
    queryFn: () => getRacks(roomId),
    enabled: !!roomId,
    retry: false,
  });
