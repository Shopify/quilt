import cookie from 'cookie';
import {hasDocumentCookie} from './utilities';
import {Cookies, CookieValue} from './types';

export {CookieContext} from './context';

export class CookieManager {
  private readonly cookies = new Map<string, CookieValue>();

  constructor(cookies: Cookies | string = {}) {
    const parsedCookies =
      typeof cookies === 'string' ? cookie.parse(cookies) : cookies;

    Object.entries(parsedCookies).forEach(([key, value]) => {
      this.setCookie(key, value);
    });
  }

  getCookie(name: string) {
    const cookie = this.cookies.get(name);

    return cookie && cookie.value;
  }

  getCookies() {
    const cookies: Cookies = {};

    for (const [key, value] of this.cookies) {
      cookies[key] = value;
    }

    return {
      ...cookies,
    };
  }

  setCookie(name: string, value: string | CookieValue) {
    const fullCookie = typeof value === 'string' ? {value} : value;

    this.cookies.set(name, fullCookie);

    if (!hasDocumentCookie()) {
      return;
    }

    const {value: cookieValue, ...options} = fullCookie;

    document.cookie = cookie.serialize(name, cookieValue, options);
  }

  removeCookie(name: string) {
    const existingCookie = this.cookies.get(name);

    this.cookies.delete(name);

    if (!hasDocumentCookie()) {
      return;
    }

    document.cookie = cookie.serialize(name, '', {
      ...existingCookie,
      expires: new Date('Thu, 01 Jan 1970 00:00:01 GMT'),
    });
  }
}
