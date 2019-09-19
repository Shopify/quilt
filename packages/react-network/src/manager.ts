import cookie from 'cookie';
import {StatusCode, CspDirective, Header} from '@shopify/network';
import {EffectKind} from '@shopify/react-effect';
import {Cookies, CookieValue} from './types';
import {hasDocumentCookie} from './utilities';

export {NetworkContext} from './context';

export const EFFECT_ID = Symbol('network');

interface Options {
  headers?: Record<string, string>;
  cookies?: Cookies | string;
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
  private readonly cookies = new Map<string, CookieValue>();

  constructor({headers, cookies}: Options = {}) {
    this.requestHeaders = normalizeHeaders(headers);
    const parsedCookies =
      typeof cookies === 'string' ? cookie.parse(cookies) : cookies;

    Object.entries(parsedCookies).forEach(([key, value]) => {
      this.setCookie(key, value);
    });
  }

  reset() {
    this.statusCodes = [];
    this.csp.clear();
    this.headers.clear();
    this.redirectUrl = undefined;
  }

  getHeader(header: string) {
    return this.requestHeaders[header.toLowerCase()];
  }

  setHeader(header: string, value: string) {
    this.headers.set(header, value);
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

    if (csp) {
      headers.set(Header.ContentSecurityPolicy, csp);
    }

    return {
      status:
        this.statusCodes.length > 0
          ? this.statusCodes.reduce((large, code) => Math.max(large, code), 0)
          : undefined,
      headers,
      cookies: this.cookies,
      redirectUrl: this.redirectUrl,
    };
  }
}

function normalizeHeaders(headers: undefined | Record<string, string>) {
  if (!headers) {
    return {};
  }

  return Object.entries(headers).reduce((accumulator, [key, value]) => {
    accumulator[key.toLowerCase()] = value;
    return accumulator;
  }, {});
}
