import { googleLogin } from '@/modules/auth/_service/auth.service';
import { PATHS } from '@/shared/config/paths';
import { setTokenCookies } from '@/shared/utils/token';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    console.log('Request URL', request.url);
    return NextResponse.redirect(new URL(PATHS.login, request.url));
  }

  try {
    const token = await googleLogin({ code, state });

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

    await setTokenCookies(response, token);

    return response;
  } catch {
    return NextResponse.redirect(new URL(PATHS.login, request.url));
  }
}
