import { type User } from '@/modules/auth/_types/user';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { type UpdateRoleInput } from '../_schema/user';

export const getUsers = async () => {
  const response = await request<User[]>({
    method: 'GET',
    path: ENDPOINTS.users.getAll,
  });

  return response;
};

export const updateUserRole = async (userId: string, body: UpdateRoleInput) => {
  const response = await request<User>({
    method: 'PATCH',
    path: ENDPOINTS.users.updateRole(userId),
    body,
  });

  return response;
};
