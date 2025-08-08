'use server';

import { NextResponse } from 'next/server';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ENV } from '@/shared/config/env';
import { COOKIE_NAME, TOKEN_MAXAGE } from '@/shared/constants/cookie';
import { Token } from '@/modules/auth/_types/auth';
import { cookies } from 'next/headers';

export async function setTokenCookies(token: Token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME.accessToken, token.accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: ENV.NODE_ENV === 'production',
    maxAge: TOKEN_MAXAGE.accessToken,
  });

  cookieStore.set(COOKIE_NAME.refreshToken, token.refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: ENV.NODE_ENV === 'production',
    maxAge: TOKEN_MAXAGE.refreshToken,
  });
}

export const isTokenExpired = async (token: string): Promise<boolean> => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);

    return Number(exp) * 1000 < Date.now();
  } catch {
    return true;
  }
};

export async function clearTokenCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME.accessToken);
  cookieStore.delete(COOKIE_NAME.refreshToken);
}
