'use server';

import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { ENV } from '@/shared/config/env';
import { COOKIE_NAME, TOKEN_MAXAGE } from '@/shared/constants/cookie';
import { type Token } from '@/modules/auth/_types/auth';
import { cookies } from 'next/headers';

export async function setTokenCookies(token: Token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME.accessToken, token.accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: ENV.NODE_ENV === 'production',
    maxAge: TOKEN_MAXAGE.accessToken,
    domain: new URL(ENV.NEXT_PUBLIC_APP_URL).hostname,
  });

  cookieStore.set(COOKIE_NAME.refreshToken, token.refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: ENV.NODE_ENV === 'production',
    maxAge: TOKEN_MAXAGE.refreshToken,
    domain: new URL(ENV.NEXT_PUBLIC_APP_URL).hostname,
  });
}

export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);

    return Number(exp) * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function clearTokenCookies() {
  const cookieStore = await cookies();

  const deleteOptions = {
    path: '/',
    domain: new URL(ENV.NEXT_PUBLIC_APP_URL).hostname,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  cookieStore.delete({
    name: COOKIE_NAME.accessToken,
    ...deleteOptions,
  });
  cookieStore.delete({
    name: COOKIE_NAME.refreshToken,
    ...deleteOptions,
  });
}

export async function getUserRoleFromToken(token: string): Promise<string | null> {
  try {
    const decoded = jwtDecode<JwtPayload & { role?: string }>(token);

    return decoded.role ?? null;
  } catch {
    return null;
  }
}
