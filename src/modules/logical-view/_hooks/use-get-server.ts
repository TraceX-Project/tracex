import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getServerById } from '../_services/servers.service';

export const useGetServer = (serverId: string) =>
  useQuery({
    queryFn: () => getServerById(serverId),
    queryKey: [QUERY_KEYS.servers, serverId],
    enabled: !!serverId,
  });
