import {Context} from 'koa';

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

  Object.entries(cookies).forEach(([cookie, options]) => {
    const {value, ...cookieOptions} = options;

    // only set cookies that have been changed
    // decode URI as the manager's cookie value is also decoded
    const rawCookieValue = ctx.cookies.get(cookie);
    if (
      rawCookieValue != null &&
      decodeURIComponent(rawCookieValue) === value
    ) {
      return;
    }

    // missing 'none` in `sameSite`
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/cookies/index.d.ts#L91
    ctx.cookies.set(cookie, value, cookieOptions as any);
  });

  return ctx;
}
