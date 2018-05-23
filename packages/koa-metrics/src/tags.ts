import {Context} from 'koa';

/* eslint-disable camelcase */
export function tagsForRequest(ctx: Context) {
  return {
    path: ctx.path,
    request_method: ctx.request.method,
  };
}

export function tagsForResponse(ctx: Context) {
  return {
    response_code: `${ctx.response.status}`,
    response_type: `${Math.floor(ctx.response.status / 100)}xx`,
  };
}
/* eslint-enable camelcase */
