import cookie from 'cookie';

import {CookieValue, Cookie} from './types';

export {CookieContext} from './context';

export class BrowserCookieManager {
  getCookie(name: string) {
    const cookies = this.parse(document.cookie);

    return cookies[name] && cookies[name].value !== ''
      ? cookies[name].value
      : undefined;
  }

  getCookies() {
    const cookies = this.parse(document.cookie || '');

    return cookies;
  }

  setCookie(name: string, value: string | CookieValue) {
    const fullCookie = typeof value === 'string' ? {value} : value;
    const {value: cookieValue, ...options} = fullCookie;

    document.cookie = cookie.serialize(name, cookieValue, options);
  }

  removeCookie(name: string) {
    document.cookie = cookie.serialize(name, '', {
      expires: new Date('Thu, 01 Jan 1970 00:00:01 GMT'),
    });
  }

  private parse(cookies: string): Cookie {
    const parsedCookies = cookie.parse(cookies);

    return Object.entries(parsedCookies).reduce(
      (newCookies, [key, value]) => ({...newCookies, [key]: {value}}),
      {} as Cookie,
    );
  }
}
