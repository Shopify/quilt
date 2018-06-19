import {Context} from 'koa';
import AsyncChunks, {defaultManifest} from '../async-chunks';

export interface Options {
  manifest: string;
}

export interface State {
  asyncChunks: AsyncChunks;
}

export function middleware({manifest}: Options = {manifest: defaultManifest}) {
  return async function asyncChunks(ctx: Context, next: () => Promise<any>) {
    ctx.state.asyncChunks = new AsyncChunks(manifest);
    await next();
  };
}
