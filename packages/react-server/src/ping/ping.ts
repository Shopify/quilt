import {StatusCode} from '@shopify/network';

export function ping(ctx: any) {
  ctx.status = StatusCode.Ok;
  ctx.body = 'Pong';
}
