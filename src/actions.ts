'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export async function setupTokenCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: 'accessToken',
    value: accessToken,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
    maxAge: 15 * 60, // 15 mins
  });

  cookieStore.set({
    name: 'refreshToken',
    value: refreshToken,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

type JwtPayload = {
  exp: number;
};

export const isTokenExpired = async (token: string): Promise<boolean> => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);

    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
