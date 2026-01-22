import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getRoom } from '../_services/floors.service';

export const useGetRoom = (roomId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.rooms, roomId],
    queryFn: () => getRoom(roomId),
    enabled: !!roomId,
  });
