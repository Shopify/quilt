import {Context} from 'koa';
import {KoaNextFunction} from '../types';

export async function mockMiddleware(_: Context, next: KoaNextFunction) {
  await next();
}
