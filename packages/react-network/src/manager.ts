import cookie, {CookieSerializeOptions} from 'cookie';
import {StatusCode, CspDirective, Header} from '@shopify/network';
import {EffectKind} from '@shopify/react-effect';

export {NetworkContext} from './context';

export const EFFECT_ID = Symbol('network');

interface Options {
  headers?: Record<string, string>;
  cookies?: string | object | null;
}

export class NetworkManager {
  readonly effect: EffectKind = {
    id: EFFECT_ID,
    afterEachPass: () => {
      return this.redirectUrl == null;
    },
    betweenEachPass: () => {
      this.reset();
    },
  };

  private statusCodes: StatusCode[] = [];
  private redirectUrl?: string;
  private readonly csp = new Map<CspDirective, string[] | boolean>();
  private readonly headers = new Map<string, string>();
  private readonly requestHeaders: Record<string, string>;
  private readonly cookies = new Map<
    string,
    {
      value: string;
    } & CookieSerializeOptions
  >();

  constructor({headers, cookies}: Options = {}) {
    this.requestHeaders = lowercaseEntries(headers);

    if (!cookies) {
      return;
    }

    const parsedCookies =
      typeof cookies === 'string' ? cookie.parse(cookies) : cookies;

    Object.entries(parsedCookies).forEach(([key, value]) => {
      this.cookies.set(key.toLowerCase(), {value});
    });
  }

  reset() {
    this.statusCodes = [];
    this.csp.clear();
    this.headers.clear();
    this.cookies.clear();
    this.redirectUrl = undefined;
  }

  getHeader(header: string) {
    return this.requestHeaders[header.toLowerCase()];
  }

  setHeader(header: string, value: string) {
    this.headers.set(header, value);
  }

  getCookie(cookie: string) {
    const value = this.cookies.get(cookie.toLowerCase());
    return value && value.value;
  }

  setCookie(
    cookie: string,
    value: string,
    options: CookieSerializeOptions = {},
  ) {
    this.cookies.set(cookie, {value, ...options});
    this.setBrowserCookie(cookie, value, options);
  }

  removeCookie(cookie: string) {
    this.cookies.delete(cookie);
    this.setBrowserCookie(cookie, '');
  }

  redirectTo(url: string, status = StatusCode.Found) {
    this.addStatusCode(status);
    this.redirectUrl = url;
  }

  addStatusCode(statusCode: StatusCode) {
    this.statusCodes.push(statusCode);
  }

  addCspDirective(directive: CspDirective, value: string | string[] | boolean) {
    const normalizedValue = typeof value === 'string' ? [value] : value;
    const currentValue = this.csp.get(directive) || [];
    const normalizedCurrentValue = Array.isArray(currentValue)
      ? currentValue
      : [String(currentValue)];

    const newValue = Array.isArray(normalizedValue)
      ? [...normalizedCurrentValue, ...normalizedValue]
      : normalizedValue;

    this.csp.set(directive, newValue);
  }

  extract() {
    const csp =
      this.csp.size === 0
        ? undefined
        : [...this.csp]
            .map(([key, value]) => {
              let printedValue: string;

              if (typeof value === 'boolean') {
                printedValue = '';
              } else if (typeof value === 'string') {
                printedValue = value;
              } else {
                printedValue = value.join(' ');
              }

              return `${key}${printedValue ? ' ' : ''}${printedValue}`;
            })
            .join('; ');

    const headers = new Map(this.headers);
    const cookies = new Map(this.cookies);

    if (csp) {
      headers.set(Header.ContentSecurityPolicy, csp);
    }

    return {
      status:
        this.statusCodes.length > 0
          ? this.statusCodes.reduce((large, code) => Math.max(large, code), 0)
          : undefined,
      headers,
      cookies,
      redirectUrl: this.redirectUrl,
    };
  }

  private get browser() {
    return Boolean(
      typeof document === 'object' && typeof document.cookie === 'string',
    );
  }

  private setBrowserCookie(
    name: string,
    value: string,
    options?: CookieSerializeOptions,
  ) {
    if (!this.browser) {
      return;
    }

    document.cookie = cookie.serialize(name, value, options);
  }
}

function lowercaseEntries(entries: undefined | Record<string, string>) {
  if (!entries) {
    return {};
  }

  return Object.entries(entries).reduce((accumulator, [key, value]) => {
    accumulator[key.toLowerCase()] = value;
    return accumulator;
  }, {});
}
