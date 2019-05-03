import {Context} from 'koa';
import {Header} from '@shopify/network';
import {NetworkManager, EFFECT_ID} from './manager';

export {NetworkContext} from './context';
export {NetworkManager, EFFECT_ID};

export function applyToContext<T extends Context>(
  ctx: T,
  manager: NetworkManager,
) {
  const {status, csp, redirectUrl} = manager.extract();
  const cspEntries = Object.entries(csp);

  if (cspEntries.length > 0) {
    const cspHeader = cspEntries
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
  }

  if (redirectUrl) {
    ctx.redirect(redirectUrl);
  }

  if (status) {
    ctx.status = status;
  }

  return ctx;
}
