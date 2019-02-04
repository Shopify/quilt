import {Context} from 'koa';
import {Header, StatusCode, CspDirective} from '@shopify/network';
import {EffectKind} from '@shopify/react-effect';
import {Manager} from './manager';

export const EFFECT_ID = Symbol('network');

export class ServerManager implements Manager {
  readonly effect: EffectKind = {
    id: EFFECT_ID,
    betweenEachPass: () => this.reset(),
  };

  private statusCodes: StatusCode[] = [];
  private csp = new Map<CspDirective, string[] | boolean>();
  private redirectUrl?: string;

  reset() {
    this.statusCodes = [];
    this.csp.clear();
    this.redirectUrl = undefined;
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
