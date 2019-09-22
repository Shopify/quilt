import {Context} from 'koa';

export enum Tag {
  Path = 'path',
  RequestMethod = 'request_method',
  ResponseCode = 'response_code',
  ResponseType = 'response_type',
}

export function tagsForRequest(ctx: Context) {
  return {
    [Tag.Path]: ctx.path,
    [Tag.RequestMethod]: ctx.request.method,
  };
}

export function tagsForResponse(ctx: Context) {
  return {
    [Tag.ResponseCode]: `${ctx.response.status}`,
    [Tag.ResponseType]: `${Math.floor(ctx.response.status / 100)}xx`,
  };
}
