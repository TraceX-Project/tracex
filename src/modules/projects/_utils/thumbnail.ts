'use server';

import puppeteer from 'puppeteer';
import { ENV } from '@/shared/config/env';
import { PATHS } from '@/shared/config/paths';
import path from 'path';
import fs from 'fs';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/shared/constants/cookie';

export const generateThumbnail = async (projectId: string) => {
  const cookieStore = await cookies();
  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    const accessToken = cookieStore.get(COOKIE_NAME.accessToken)?.value;
    const refreshToken = cookieStore.get(COOKIE_NAME.refreshToken)?.value;

    if (!accessToken || !refreshToken) {
      throw new Error('Missing authentication cookies');
    }

    await page.setCookie(
      {
        name: COOKIE_NAME.accessToken,
        value: accessToken,
        domain: new URL(ENV.NEXT_PUBLIC_APP_URL).hostname,
        path: '/',
      },
      {
        name: COOKIE_NAME.refreshToken,
        value: refreshToken,
        domain: new URL(ENV.NEXT_PUBLIC_APP_URL).hostname,
        path: '/',
      }
    );

    const projectUrl = `${ENV.NEXT_PUBLIC_APP_URL}${PATHS.projects.detail(projectId)}`;
    await page.goto(projectUrl, { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 800, height: 600 });

    const outputDir = path.join(process.cwd(), 'public/thumbnails');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${projectId}.png`);
    await page.screenshot({ path: outputPath as `${string}.png`, type: 'png' });
  } finally {
    await browser.close();
  }
};
