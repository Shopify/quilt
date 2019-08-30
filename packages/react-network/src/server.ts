import {Context} from 'koa';
import Cookies, {CookieChangeOptions} from 'universal-cookie';
import {SetOption} from 'cookies';
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

  (ctx.request as any).universalCookies = new Cookies(extractCookies(cookies));

  (ctx.request as any).universalCookies.addChangeListener(
    (change: CookieChangeOptions) => {
      if (change.value === undefined) {
        ctx.cookies.set(change.name, undefined);
      } else {
        ctx.cookies.set(change.name, change.value, change.options as SetOption);
      }
    },
  );

  // eslint-disable-next-line no-warning-comments
  // TODO: Add a watcher function that reapplies the cookies
  // to context when they change

  return ctx;
}

function extractCookies(map: Map<any, any>) {
  return Array.from(map).reduce((accumulator, [key, value]) => {
    accumulator[key] = value.value;
    return accumulator;
  }, {});
}
