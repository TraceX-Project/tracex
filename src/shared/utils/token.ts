import { NextResponse } from 'next/server';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ENV } from '@/shared/config/env';
import { COOKIE_NAME, TOKEN_MAXAGE } from '@/shared/_constants/cookie';
import { TokenResponse } from '@/modules/auth/_types/auth';

export async function setTokenCookies(response: NextResponse, tokens: TokenResponse) {
  response.cookies.set({
    name: COOKIE_NAME.accessToken,
    value: tokens.accessToken,
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: ENV.NODE_ENV === 'production',
    maxAge: TOKEN_MAXAGE.accessToken,
  });

  response.cookies.set({
    name: COOKIE_NAME.refreshToken,
    value: tokens.refreshToken,
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
