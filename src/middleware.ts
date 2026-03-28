import { type NextRequest, NextResponse } from 'next/server';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

import { PATHS } from '@/shared/config/paths';
import { COOKIE_NAME, TOKEN_MAXAGE } from './shared/constants/cookie';
import { UserRole } from './modules/auth/_types/user';
import { ENV } from './shared/config/env';
import { ENDPOINTS } from './shared/config/endpoints';

const publicRoutes = [PATHS.auth.callback, PATHS.login, PATHS.terms, PATHS.privacy];

const isAdminRoute = (pathname: string) => pathname.startsWith('/admin');

function isExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Number(exp) * 1000 < Date.now();
  } catch {
    return true;
  }
}

function getRoleFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<JwtPayload & { role?: string }>(token);
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

async function callRefresh(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const response = await fetch(`${ENV.NEXT_PUBLIC_API_URL}${ENDPOINTS.auth.refresh}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function setTokensOnResponse(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  const hostname = new URL(ENV.NEXT_PUBLIC_APP_URL).hostname;
  const secure = ENV.NODE_ENV === 'production';

  response.cookies.set(COOKIE_NAME.accessToken, tokens.accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure,
    maxAge: TOKEN_MAXAGE.accessToken,
    domain: hostname,
  });
  response.cookies.set(COOKIE_NAME.refreshToken, tokens.refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure,
    maxAge: TOKEN_MAXAGE.refreshToken,
    domain: hostname,
  });
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(COOKIE_NAME.accessToken)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAME.refreshToken)?.value;

  if (pathname === PATHS.root) {
    return NextResponse.redirect(new URL(PATHS.projects.root, request.url));
  }

  const isPublicRoute = publicRoutes.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL(PATHS.login, request.url));
  }

  let currentAccessToken = accessToken;

  if (!accessToken || isExpired(accessToken)) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL(PATHS.login, request.url));
    }

    const newTokens = await callRefresh(refreshToken);
    if (!newTokens) {
      return NextResponse.redirect(new URL(PATHS.login, request.url));
    }

    currentAccessToken = newTokens.accessToken;

    const response = NextResponse.next();
    setTokensOnResponse(response, newTokens);

    if (isAdminRoute(pathname) && getRoleFromToken(currentAccessToken) !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL(PATHS.projects.root, request.url));
    }

    return response;
  }

  if (pathname === PATHS.login) {
    return NextResponse.redirect(new URL(PATHS.root, request.url));
  }

  if (isAdminRoute(pathname) && getRoleFromToken(currentAccessToken ?? '') !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL(PATHS.projects.root, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
