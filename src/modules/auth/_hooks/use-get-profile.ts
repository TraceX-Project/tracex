import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../_service/users.service';

export const useGetProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  });
