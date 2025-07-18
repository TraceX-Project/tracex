import { googleLogin } from '@/modules/auth/_service/auth.service';
import { COOKIE_NAME } from '@/shared/_constants/cookie';
import { ENV } from '@/shared/config/env';
import { PATHS } from '@/shared/config/paths';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(new URL(PATHS.login, request.url));
  }

  try {
    const { accessToken, refreshToken } = await googleLogin({ code, state });

    const response = new NextResponse(
      `
      <script>
        window.location.href = '${PATHS.root}';
      </script>
    `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );

    response.cookies.set({
      name: COOKIE_NAME.accessToken,
      value: accessToken,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 15 * 60,
    });

    response.cookies.set({
      name: COOKIE_NAME.refreshToken,
      value: refreshToken,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL(PATHS.login, request.url));
  }
}
