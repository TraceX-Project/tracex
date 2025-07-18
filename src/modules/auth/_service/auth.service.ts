import { ENDPOINTS } from '@/shared/config/endpoints';
import axios from '@/shared/lib/axios';
import {
  GetGoogleLoginUrlResponse,
  GoogleLoginRequest,
  RefreshTokenRequest,
  TokenResponse,
} from '../_types/auth';

export const getGoogleLoginUrl = async () => {
  const response = await axios.get<GetGoogleLoginUrlResponse>(ENDPOINTS.auth.googleLoginLink);

  return response.data;
};

export const googleLogin = async (data: GoogleLoginRequest) => {
  const response = await axios.post<TokenResponse>(ENDPOINTS.auth.googleLogin, data);

  return response.data;
};

export const refresh = async (data: RefreshTokenRequest) => {
  const response = await axios.post<TokenResponse>(ENDPOINTS.auth.refresh, data);

  return response.data;
};

export const logout = async () => {
  const response = await axios.post(ENDPOINTS.auth.logout);

  return response.data;
};
