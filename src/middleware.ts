import { type NextRequest, NextResponse } from 'next/server';

import { PATHS } from '@/shared/config/paths';
import { COOKIE_NAME } from './shared/constants/cookie';
import { getUserRoleFromToken } from './modules/auth/_utils/token';
import { UserRole } from './modules/auth/_types/user';

const publicRoutes = [PATHS.auth.callback, PATHS.login, PATHS.terms, PATHS.privacy];

const isAdminRoute = (pathname: string) => {
  return pathname.startsWith('/admin');
};

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

  if (isAdminRoute(pathname)) {
    const userRole = await getUserRoleFromToken(accessToken || '');

    if (userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL(PATHS.projects.root, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
