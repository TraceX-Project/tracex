'use server';

import { cookies } from 'next/headers';
import { ENV } from '../config/env';
import { COOKIE_NAME } from '../constants/cookie';
import { isTokenExpired, setTokenCookies } from '@/modules/auth/_utils/token';
import { type ErrorResponse, type SuccessResponse } from '../types/response';
import { ENDPOINTS } from '../config/endpoints';
import { type Token } from '@/modules/auth/_types/auth';
import { redirect } from 'next/navigation';
import { PATHS } from '../config/paths';
import { ApiError } from './api-error';
import { getFilenameFromContentDisposition } from '../utils/file';

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
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const requestBody = body ? (isFormData ? body : JSON.stringify(body)) : undefined;

  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
  });

  const result = await response.json();

  if (!response.ok) {
    if (
      typeof result === 'object' &&
      result !== null &&
      'error' in result &&
      typeof (result as ErrorResponse).error === 'string'
    ) {
      console.log('API Error Details:', result);
      const { message } = result as ErrorResponse;

      if (typeof message === 'string' && message.length > 0) {
        throw new ApiError(message.charAt(0).toUpperCase() + message.slice(1), response.status);
      }

      throw new ApiError('An error occurred while processing your request', response.status);
    }

    throw new ApiError('An error occurred while processing your request', response.status);
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

  const token = (await response.json()) as SuccessResponse<Token>;

  await setTokenCookies(token);

  return token;
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
    } catch {
      redirect(PATHS.login);
    }
  }

  return apiFetch<T>(url, method, token, body);
}

export async function download({
  method,
  path,
  body,
  auth = true,
}: RequestOptions): Promise<{ data: string; contentType: string; filename: string }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME.accessToken)?.value;
  const refreshToken = cookieStore.get(COOKIE_NAME.refreshToken)?.value;
  const url = `${ENV.NEXT_PUBLIC_API_URL}${path}`;

  let token = accessToken;

  if (auth && (!accessToken || (await isTokenExpired(accessToken)))) {
    if (refreshToken) {
      try {
        const { accessToken: newAccessToken } = await refresh(refreshToken);
        token = newAccessToken;
      } catch {}
    }
  }

  const headers: HeadersInit = {};
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  headers['Content-Type'] = 'application/json';

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError('Download failed', response.status);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
  const contentDisposition = response.headers.get('content-disposition');
  const filename = getFilenameFromContentDisposition(contentDisposition);

  return { data: base64, contentType, filename };
}
