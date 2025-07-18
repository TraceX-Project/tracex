import axios from '@/shared/lib/axios';
import { User } from '../_types/user';
import { ENDPOINTS } from '@/shared/config/endpoints';

export const getUserProfile = async () => {
  const response = await axios.get<User>(ENDPOINTS.users.profile);

  return response.data;
};
