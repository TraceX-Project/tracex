import { QUERY_KEYS } from '@/shared/constants/query-key';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../_services/users.service';

export const useGetUsers = () =>
  useQuery({
    queryKey: [QUERY_KEYS.users],
    queryFn: getUsers,
  });
