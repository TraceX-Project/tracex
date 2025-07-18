'use server';

import { User } from '../_types/user';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';

export const getUserProfile = async () => {
  return request<User>({
    method: 'GET',
    path: ENDPOINTS.users.profile,
  });
};
