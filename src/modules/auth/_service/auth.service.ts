import { ENDPOINTS } from '@/shared/config/endpoints';
import { GetGoogleLoginUrlResponse, GoogleLoginRequest, Token } from '../_types/auth';
import { request } from '@/shared/lib/api';
import { clearTokenCookies } from '@/modules/auth/_utils/token';

export const getGoogleLoginUrl = async () => {
  const response = await request<GetGoogleLoginUrlResponse>({
    method: 'GET',
    path: ENDPOINTS.auth.googleLoginLink,
    auth: false,
  });

  return response.data;
};

export const googleLogin = async (data: GoogleLoginRequest) => {
  const response = await request<Token>({
    method: 'POST',
    path: ENDPOINTS.auth.googleLogin,
    body: data,
    auth: false,
  });

  return response.data;
};

export const logout = async () => {
  await request({
    method: 'POST',
    path: ENDPOINTS.auth.logout,
  });

  await clearTokenCookies();
};
