import {StatusCode, CspDirective, Header} from '@shopify/network';
import {EffectKind} from '@shopify/react-effect';

import {ServerCookieManager, Cookie} from './ServerCookieManager';

export {NetworkContext} from './context';

export const EFFECT_ID = Symbol('network');

interface Options {
  headers?: Record<string, string>;
  cookies?: Cookie | string;
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

  cookies: ServerCookieManager;

  private statusCodes: StatusCode[] = [];
  private redirectUrl?: string;
  private readonly csp = new Map<CspDirective, string[] | boolean>();
  private readonly headers = new Map<string, string>();
  private readonly requestHeaders: Record<string, string>;

  constructor({headers, cookies}: Options = {}) {
    this.requestHeaders = normalizeHeaders(headers);
    this.cookies = new ServerCookieManager(cookies);
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

    if (csp) {
      headers.set(Header.ContentSecurityPolicy, csp);
    }

    return {
      status:
        this.statusCodes.length > 0
          ? this.statusCodes.reduce((large, code) => Math.max(large, code), 0)
          : undefined,
      headers,
      cookies: this.cookies.getCookies(),
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
