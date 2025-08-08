import { NextRequest, NextResponse } from 'next/server';

import { PATHS } from '@/shared/config/paths';
import { COOKIE_NAME } from './shared/constants/cookie';

const publicRoutes = [PATHS.auth.callback, PATHS.login, PATHS.terms, PATHS.privacy];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(COOKIE_NAME.accessToken)?.value;

  if (pathname === PATHS.root) {
    return NextResponse.redirect(new URL(PATHS.projects.root, request.url));
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
