'use server';

import puppeteer from 'puppeteer';
import { ENV } from '@/shared/config/env';
import { PATHS } from '@/shared/config/paths';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/shared/constants/cookie';
import { ENDPOINTS } from '@/shared/config/endpoints';
import { request } from '@/shared/lib/api';
import { convertBufferToFile } from '@/shared/utils/file';

export const captureAndSaveThumbnail = async (projectId: string) => {
  const cookieStore = await cookies();
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--no-zygote',
      '--single-process',
    ],
  });

  try {
    const page = await browser.newPage();

    const accessToken = cookieStore.get(COOKIE_NAME.accessToken)?.value;
    const refreshToken = cookieStore.get(COOKIE_NAME.refreshToken)?.value;

    if (!accessToken || !refreshToken) {
      throw new Error('Missing authentication cookies');
    }

    await page.browserContext().setCookie(
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

    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    const projectUrl = `${ENV.NEXT_PUBLIC_APP_URL}${PATHS.projects.logical(projectId)}`;
    await page.goto(projectUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for the main content to be present
    await page.waitForSelector('#project-main-content', { timeout: 10000 });

    // Wait for fitView animation and rendering stability
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Hide UI elements that should not be in the thumbnail
    await page.evaluate(() => {
      const tabs = document.getElementById('view-tabs-container');
      if (tabs) {
        tabs.style.display = 'none';
      }

      const controls = document.querySelector('.react-flow__controls');
      if (controls) {
        (controls as HTMLElement).style.display = 'none';
      }

      const attribution = document.querySelector('.react-flow__attribution');
      if (attribution) {
        (attribution as HTMLElement).style.display = 'none';
      }
    });

    const element = await page.$('#project-main-content');
    if (!element) {
      throw new Error('Main content element not found');
    }

    const buffer = await element.screenshot({ type: 'png' });
    const file = convertBufferToFile(buffer, `${projectId}-${Date.now()}.png`);

    const formData = new FormData();
    formData.append('file', file);

    return await request<void>({
      method: 'PATCH',
      path: ENDPOINTS.projects.thumbnail(projectId),
      body: formData,
    });
  } finally {
    await browser.close();
  }
};
