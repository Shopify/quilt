import {Context} from 'koa';

export interface KoaNextFunction {
  (): Promise<any>;
}

/**
 * Takes a koa Context object and returns some value derived from it.
 * This is useful when a user needs to dynamically define an option for a middlewarebased on the incoming context object for that request.
 */
export interface ValueFromContext<T> {
  (ctx: Context): T;
}
