'use server';

import puppeteer from 'puppeteer';
import { ENV } from '@/shared/config/env';
import { PATHS } from '@/shared/config/paths';
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

    const projectUrl = `${ENV.NEXT_PUBLIC_APP_URL}${PATHS.projects.logical(projectId)}`;
    await page.goto(projectUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    await page.evaluate(() => {
      const tabs = document.getElementById('view-tabs-container');
      if (tabs) tabs.style.display = 'none';
      const controls = document.querySelector('.react-flow__controls');
      if (controls) (controls as HTMLElement).style.display = 'none';
      const attribution = document.querySelector('.react-flow__attribution');
      if (attribution) (attribution as HTMLElement).style.display = 'none';
    });
    
    const element = await page.$('#project-main-content');
    if (!element) throw new Error('Main content element not found');

    return await element.screenshot({ type: 'png' });
  } finally {
    await browser.close();
  }
};
