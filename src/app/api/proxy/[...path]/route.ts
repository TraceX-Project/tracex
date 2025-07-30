import { COOKIE_NAME } from '@/shared/_constants/cookie';
import { ENV } from '@/shared/config/env';
import { isTokenExpired, setTokenCookies } from '@/modules/auth/_utils/token';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  return handleRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  return handleRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  return handleRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  return handleRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  return handleRequest(request, path);
}

async function handleRequest(request: NextRequest, apiPaths: string[]) {
  const apiPath = apiPaths.join('/');

  const apiUrl = `${ENV.NEXT_PUBLIC_API_URL}/${apiPath}`;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME.accessToken)?.value;
  const refreshToken = cookieStore.get(COOKIE_NAME.refreshToken)?.value;
  const method = request.method;
  const requestBody = ['POST', 'PUT', 'PATCH'].includes(method) ? await request.json() : undefined;

  try {
    const response = await fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: JSON.stringify(requestBody) || undefined,
    });

    const data = await response.json();

    if (!response.ok && response.status !== 401) {
      return NextResponse.json(data, { status: response.status });
    }

    if (response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const isExpired = accessToken ? await isTokenExpired(accessToken) : true;

    if (isExpired && refreshToken) {
      const refreshUrl = `${ENV.NEXT_PUBLIC_API_URL}/auth/refresh`;
      const refreshResponse = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const newTokens = await refreshResponse.json();

      const retryResponse = await fetch(apiUrl, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newTokens.data.accessToken}`,
        },
      });

      const retryData = await retryResponse.json();
      if (!retryResponse.ok) {
        return NextResponse.json(retryData, { status: retryResponse.status });
      }

      const response = NextResponse.json(retryData, { status: retryResponse.status });

      await setTokenCookies(response, newTokens.data);

      return response;
    }

    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    console.error('Error in proxy handler:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
