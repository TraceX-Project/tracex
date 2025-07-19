import { NextRequest, NextResponse } from 'next/server';
import { refresh } from '@/modules/auth/_service/auth.service';

import { PATHS } from '@/shared/config/paths';
import { COOKIE_NAME } from './shared/_constants/cookie';
import { isTokenExpired, setTokenCookies } from './shared/utils/token';

const publicRoutes = [PATHS.auth.callback, PATHS.login, PATHS.terms, PATHS.privacy];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(COOKIE_NAME.accessToken)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAME.refreshToken)?.value;

  console.log(`Middleware triggered for ${pathname}`);

  if (pathname === PATHS.root) {
    return NextResponse.redirect(new URL(PATHS.project, request.url));
  }

  if (pathname === PATHS.login && accessToken) {
    return NextResponse.redirect(new URL(PATHS.root, request.url));
  }

  const isPublicRoute = publicRoutes.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  console.log(`Access Token: ${accessToken}`);

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL(PATHS.login, request.url));
  }

  const isExpired = accessToken ? await isTokenExpired(accessToken) : true;
  if (isExpired && refreshToken) {
    try {
      const newTokens = await refresh({ refreshToken });

      const response = NextResponse.next();

      setTokenCookies(response, newTokens);

      return response;
    } catch (error) {
      return NextResponse.redirect(new URL(PATHS.login, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
