import compose from 'koa-compose';
import {Middleware, Context, NextFunction} from '../types';

export interface KoaNextFunction {
  (): Promise<any>;
}

export {compose};

export async function noopNext() {}

export function runIf<CustomContext extends Context>(
  condition: (ctx: CustomContext) => boolean | Promise<boolean>,
  ifMiddleware: Middleware<CustomContext>,
  elseMiddleware?: Middleware<CustomContext>,
): Middleware<CustomContext> {
  return async function conditionalMiddleware(
    ctx: CustomContext,
    next: NextFunction,
  ) {
    if (await condition(ctx)) {
      await ifMiddleware(ctx, next);
    } else if (elseMiddleware) {
      await elseMiddleware(ctx, next);
    } else {
      await next();
    }
  };
}
