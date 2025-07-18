'use server';

import axios, { AxiosInstance } from 'axios';
import { ENV } from '../config/env';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '../_constants/cookie';

const instance: AxiosInstance = axios.create({
  baseURL: ENV.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(COOKIE_NAME.accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken?.value}`;
  }

  return config;
});

export default instance;
