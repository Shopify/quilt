import {Context} from 'koa';
import {Header, StatusCode, CspDirective} from '@shopify/network';
import {Manager} from './manager';

export class ServerManager implements Manager {
  private statusCodes: StatusCode[] = [];
  private csp = new Map<CspDirective, string[] | boolean>();
  private redirectUrl?: string;

  redirectTo(url: string, status = StatusCode.Found) {
    this.addStatusCode(status);
    this.redirectUrl = url;
  }

  addStatusCode(statusCode: StatusCode) {
    this.statusCodes.push(statusCode);
  }

  addCspDirective(directive: CspDirective, value: string | string[] | boolean) {
    const normalizedValue = typeof value === 'string' ? [value] : value;
    const newValue = Array.isArray(value)
      ? [...(this.csp.get(directive) || []), ...normalizedValue]
      : normalizedValue;

    this.csp.set(directive, newValue);
  }

  extract() {
    return {
      status:
        this.statusCodes.length > 0
          ? this.statusCodes.reduce((large, code) => Math.max(large, code), 0)
          : undefined,
      csp: [...this.csp.entries()].reduce<{
        [key: string]: string[] | string | boolean;
      }>((csp, [directive, value]) => ({...csp, [directive]: value}), {}),
      redirectUrl: this.redirectUrl,
    };
  }
}

export function applyToContext<T extends Context>(
  ctx: T,
  manager: ServerManager,
) {
  const {status, csp, redirectUrl} = manager.extract();
  const cspHeader = Object.entries(csp)
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

  ctx.set(Header.ContentSecurityPolicy, cspHeader);

  if (redirectUrl) {
    ctx.redirect(redirectUrl);
  }

  if (status) {
    ctx.status = status;
  }

  return ctx;
}
