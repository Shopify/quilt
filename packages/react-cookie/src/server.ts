import {Context} from 'koa';
import {Cookie} from './types';

export function applyCookieToContext(cookies: Cookie) {
  return function(ctx: Context) {
    Object.entries(cookies).forEach(([cookie, options]) => {
      const {value, ...cookieOptions} = options;

      ctx.cookies.set(cookie, value, cookieOptions as any);
    });
  };
}
