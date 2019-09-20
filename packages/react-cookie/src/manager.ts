import cookie from 'cookie';
import {hasDocumentCookie} from './utilities';
import {CookieValue, Cookie} from './types';

export {CookieContext} from './context';

export class CookieManager {
  getCookie(name: string) {
    if (!hasDocumentCookie()) {
      return;
    }

    const cookies = this.parse(document.cookie);

    return cookies[name] && cookies[name].value;
  }

  getCookies() {
    if (!hasDocumentCookie()) {
      return;
    }

    const cookies = this.parse(document.cookie);

    return cookies;
  }

  setCookie(name: string, value: string | CookieValue) {
    if (!hasDocumentCookie()) {
      return;
    }

    const fullCookie = typeof value === 'string' ? {value} : value;
    const {value: cookieValue, ...options} = fullCookie;

    document.cookie = cookie.serialize(name, cookieValue, options);
  }

  removeCookie(name: string) {
    if (!hasDocumentCookie()) {
      return;
    }

    document.cookie = cookie.serialize(name, '', {
      expires: new Date('Thu, 01 Jan 1970 00:00:01 GMT'),
    });
  }

  private parse(cookies: string) {
    let newCookies: Cookie | undefined;
    const parsedCookies = cookie.parse(cookies);

    Object.entries(parsedCookies).forEach(([key, value]) => {
      if (!newCookies) {
        newCookies = {[key]: {value}};
      } else {
        newCookies[key] = {value};
      }
    });

    return newCookies || {};
  }
}
