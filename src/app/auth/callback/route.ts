import { googleLogin } from '@/modules/auth/_service/auth.service';
import { ENV } from '@/shared/config/env';
import { PATHS } from '@/shared/config/paths';
import { setTokenCookies } from '@/shared/utils/token';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';

  if (!code || !state) {
    console.log('Request URL', request);

    if (forwardedHost) {
      return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${PATHS.login}`);
    }

    return NextResponse.redirect(new URL(PATHS.login, request.url));
  }

  try {
    const token = await googleLogin({ code, state });

    const response = new NextResponse(
      `
      <script>
        window.location.href = '${PATHS.root}';
      </script>x
    `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );

    await setTokenCookies(response, token);

    return response;
  } catch {
    if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${PATHS.login}`);
    }

    return NextResponse.redirect(new URL(PATHS.login, request.url));
  }
}
