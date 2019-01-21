import {StatusCode, CspDirective} from '@shopify/network';
import {EffectKind} from '@shopify/react-effect';

export interface Manager {
  effect?: EffectKind;
  redirectTo(url: string, status?: StatusCode): void;
  addStatusCode(statusCode: StatusCode): void;
  addCspDirective(
    directive: CspDirective,
    value: boolean | string | string[],
  ): void;
}

export class NoopManager implements Manager {
  redirectTo() {}
  addStatusCode() {}
  addCspDirective() {}
}
