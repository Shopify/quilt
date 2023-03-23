import {URL} from 'url';

import type {Browser} from 'puppeteer';
import puppeteer from 'puppeteer';

export class AppBrowser {
  constructor(private readonly browser: Browser, private readonly url: URL) {}

  async go(url = '') {
    const page = await this.browser.newPage();

    page.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });

    page.on('pageerror', (error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });

    page.on('console', (consoleMessage) => {
      // eslint-disable-next-line no-console
      console.log(consoleMessage.text());
    });

    await page.goto(new URL(url, this.url).href);
    return page;
  }

  async terminate() {
    await this.browser.close();
  }
}

export async function createBrowser({url}: {url: URL}) {
  const browser = await puppeteer.launch({
    headless: true,
    // eslint-disable-next-line no-process-env
    executablePath: process.env.CI ? 'google-chrome-stable' : undefined,
    args: ['--no-sandbox'],
  });
  return new AppBrowser(browser, url);
}
