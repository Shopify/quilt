import {noCache, Header} from '@shopify/network';
import {Context, NextFunction} from '..';

export async function disableCaching(ctx: Context, next: NextFunction) {
  ctx.set(Header.CacheControl, noCache);
  await next();
}
