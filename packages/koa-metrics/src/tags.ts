import {Context} from 'koa';

export enum Tags {
  Path = 'path',
  RequestMethod = 'request_method',
  ResponseCode = 'response_code',
  ResponseType = 'response_type',
}

export function tagsForRequest(ctx: Context) {
  return {
    [Tags.Path]: ctx.path,
    [Tags.RequestMethod]: ctx.request.method,
  };
}

export function tagsForResponse(ctx: Context) {
  return {
    [Tags.ResponseCode]: `${ctx.response.status}`,
    [Tags.ResponseType]: `${Math.floor(ctx.response.status / 100)}xx`,
  };
}
