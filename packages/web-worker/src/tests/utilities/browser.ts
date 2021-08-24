import {URL} from 'url';

import puppeteer, {Browser} from 'puppeteer';

export class AppBrowser {
  constructor(private readonly browser: Browser, private readonly url: URL) {}

  async go(url = '') {
    const page = await this.browser.newPage();

    page.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });

    page.on('pageerror', (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
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
  const browser = await puppeteer.launch();
  return new AppBrowser(browser, url);
}
