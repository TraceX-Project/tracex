import { QUERY_KEYS } from '@/shared/constants/query-key';
import { getQueryClient } from '@/shared/tanstack-query/get-query-client';
import { useMutation } from '@tanstack/react-query';
import { updateUserRole } from '../_services/users.service';
import { type UpdateRoleInput } from '../_schema/user';

export const useUpdateRole = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: UpdateRoleInput }) =>
      updateUserRole(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] });
    },
  });
};
