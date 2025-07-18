'use server';

import { ENDPOINTS } from '@/shared/config/endpoints';
import {
  GetGoogleLoginUrlResponse,
  GoogleLoginRequest,
  RefreshTokenRequest,
  Token,
} from '../_types/auth';
import { request } from '@/shared/lib/api';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/shared/_constants/cookie';

export const getGoogleLoginUrl = async () => {
  const response = await request<GetGoogleLoginUrlResponse>({
    method: 'GET',
    path: ENDPOINTS.auth.googleLoginLink,
  });

  return response;
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
  await request<void>({
    method: 'POST',
    path: ENDPOINTS.auth.logout,
  });

  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME.accessToken);
  cookieStore.delete(COOKIE_NAME.refreshToken);
};
