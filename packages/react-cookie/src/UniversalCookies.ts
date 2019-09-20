import cookie from 'cookie';
import {Context} from 'koa'
import {Cookie, CookieValue} from './types';

export {CookieContext} from './context';

export class UniversalCookies {
  private readonly cookies = new Map<string, CookieValue>();

  constructor(cookies: Cookie | string = {}) {
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
    const cookies: Cookie = {};

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
  }

  removeCookie(name: string) {
    this.cookies.delete(name);
  }

  applyToContext(ctx: Context) {
    for (const [cookie, options] of this.cookies) {
      const {value, ...cookieOptions} = options;

      ctx.cookies.set(cookie, value, cookieOptions as any);
    }
  }
}
