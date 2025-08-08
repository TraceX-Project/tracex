'use server';

import { cookies } from 'next/headers';
import { ENV } from '../config/env';
import { COOKIE_NAME } from '../_constants/cookie';
import { isTokenExpired, setTokenCookies } from '@/modules/auth/_utils/token';
import { SuccessResponse } from '../types/response';
import { ENDPOINTS } from '../config/endpoints';
import { Token } from '@/modules/auth/_types/auth';
import { redirect } from 'next/navigation';
import { PATHS } from '../config/paths';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method: HttpMethod;
  path: string;
  body?: unknown;
  auth?: boolean;
};

const apiFetch = async <T>(
  url: string,
  method: HttpMethod,
  token?: string,
  body?: unknown
): Promise<SuccessResponse<T>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json();

  if (!response.ok) {
    if (typeof result.error === 'string') {
      result.error = result.error.charAt(0).toUpperCase() + result.error.slice(1);
    }

    throw new Error(result.error || 'An error occurred while processing your request');
  }

  return result as SuccessResponse<T>;
};

const refresh = async (refreshToken: string): Promise<Token> => {
  const refreshUrl = `${ENV.NEXT_PUBLIC_API_URL}${ENDPOINTS.auth.refresh}`;
  const response = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Unauthorized: Refresh token is invalid or expired');
  }

  const { data: token } = await response.json();

  setTokenCookies(token);

  return token as Token;
};

export async function request<T>({
  method,
  path,
  body,
  auth = true,
}: RequestOptions): Promise<SuccessResponse<T>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME.accessToken)?.value;
  const refreshToken = cookieStore.get(COOKIE_NAME.refreshToken)?.value;
  const url = `${ENV.NEXT_PUBLIC_API_URL}${path}`;

  if (!auth) {
    return apiFetch<T>(url, method, undefined, body);
  }

  if (!accessToken && !refreshToken) {
    redirect(PATHS.login);
  }

  let token = accessToken;

  if (!accessToken || (await isTokenExpired(accessToken))) {
    if (!refreshToken) {
      redirect(PATHS.login);
    }

    try {
      const { accessToken } = await refresh(refreshToken);
      token = accessToken;
    } catch (error) {
      redirect(PATHS.login);
    }
  }

  return apiFetch<T>(url, method, token, body);
}
