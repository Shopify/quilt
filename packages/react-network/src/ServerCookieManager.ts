import cookie, {CookieSerializeOptions} from 'cookie';

export type CookieValue = {
  value: string;
} & CookieSerializeOptions;

export type Cookie = {[key: string]: CookieValue};

export class ServerCookieManager {
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
    this.cookies.set(name, {
      value: '',
      expires: new Date('Thu, 01 Jan 1970 00:00:01 GMT'),
    });
  }

  clear() {
    this.cookies.clear();
  }
}
