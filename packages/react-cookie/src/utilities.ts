import {BrowserCookieManager} from './BrowserCookieManager';
import type {Cookie} from './types';

export function clearCookies() {
  const cookies = new BrowserCookieManager();
  const allCookies = cookies.getCookies();

  for (const key of Object.keys(allCookies)) {
    cookies.removeCookie(key);
  }

  return cookies;
}

export function createCookies(initialCookies: Cookie = {}) {
  const cookies = new BrowserCookieManager();

  for (const [key, value] of Object.entries(initialCookies)) {
    cookies.setCookie(key, value);
  }

  return cookies;
}

export function hasDocumentCookie() {
  return Boolean(
    typeof document === 'object' && typeof document.cookie === 'string',
  );
}
