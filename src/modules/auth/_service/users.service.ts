import { User } from '../_types/user';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { SuccessResponse } from '@/shared/types/response';
import axios from '@/shared/lib/axios';

export const getUserProfile = async () => {
  const { data } = await axios.get<SuccessResponse<User>>(ENDPOINTS.users.profile);

  return data.data;
};
