import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../_service/users.service';
import { QUERY_KEYS } from '../_config/config';

export const useGetProfile = () =>
  useQuery({
    queryKey: [QUERY_KEYS.profile],
    queryFn: getUserProfile,
  });
