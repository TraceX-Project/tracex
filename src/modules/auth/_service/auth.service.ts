import { ENDPOINTS } from '@/shared/config/endpoints';
import {
  GetGoogleLoginUrlResponse,
  GoogleLoginRequest,
  RefreshTokenRequest,
  Token,
} from '../_types/auth';
import { request } from '@/shared/lib/api';
import axios from '@/shared/lib/axios';
import { SuccessResponse } from '@/shared/types/response';
import { clearTokenCookies } from '@/modules/auth/_utils/token';

export const getGoogleLoginUrl = async () => {
  const { data } = await axios.get<SuccessResponse<GetGoogleLoginUrlResponse>>(
    ENDPOINTS.auth.googleLoginLink
  );

  return data.data;
};

export const googleLogin = async (data: GoogleLoginRequest) => {
  const response = await request<Token>({
    method: 'POST',
    path: ENDPOINTS.auth.googleLogin,
    body: data,
  });

  return response;
};

export const refresh = async (data: RefreshTokenRequest) => {
  const response = await request<Token>({
    method: 'POST',
    path: ENDPOINTS.auth.refresh,
    body: data,
  });

  return response;
};

export const logout = async () => {
  await axios.post(ENDPOINTS.auth.logout, {});

  await clearTokenCookies();
};
