import {BrowserCookieManager} from '../BrowserCookieManager';

export function clearCookies() {
  const cookies = new BrowserCookieManager();
  const allCookies = cookies.getCookies();

  for (const key of Object.keys(allCookies)) {
    cookies.removeCookie(key);
  }

  return cookies;
}
