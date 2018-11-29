import {StatusCode, CspDirective} from '@shopify/network';

export interface Manager {
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
