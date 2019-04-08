import {StatusCode, CspDirective} from '@shopify/network';
import {EffectKind} from '@shopify/react-effect';

export {NetworkContext} from './context';

export const EFFECT_ID = Symbol('network');

export class NetworkManager {
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
