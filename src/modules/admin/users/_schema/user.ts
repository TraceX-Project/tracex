import { UserRole } from '@/modules/auth/_types/user';
import z from 'zod';

export const updateRoleSchema = z.object({
  role: z.enum(UserRole, {
    message: 'Role must be one of the predefined roles',
  }),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
