import {Context} from 'koa';
import {applyCookieToContext} from '@shopify/react-cookie/server';
import {NetworkManager, EFFECT_ID} from './manager';

export {NetworkContext} from './context';
export {NetworkManager, EFFECT_ID};

export function applyToContext<T extends Context>(
  ctx: T,
  manager: NetworkManager,
) {
  const {status, redirectUrl, headers, cookies} = manager.extract();

  if (redirectUrl) {
    ctx.redirect(redirectUrl);
  }

  if (status) {
    ctx.status = status;
  }

  for (const [header, value] of headers) {
    ctx.set(header, value);
  }

  applyCookieToContext(cookies)(ctx);
  return ctx;
}
