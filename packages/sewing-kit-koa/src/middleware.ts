import {join} from 'path';
import {Context, Middleware} from 'koa';
import serve from 'koa-static';
import compose from 'koa-compose';
import mount from 'koa-mount';
import appRoot from 'app-root-path';

import {Header} from '@shopify/network';

import Assets, {Asset} from './assets';

export {Assets, Asset};

export interface Options {
  assetPrefix?: string | ((ctx: Context) => string);
  serveAssets?: boolean;
  manifestPath?: string;
}

const ASSETS = Symbol('assets');

export function getAssets(ctx: Context): Assets {
  return ctx.state[ASSETS];
}

export function setAssets(ctx: Context, assets: Assets) {
  ctx.state[ASSETS] = assets;
}

export default function middleware({
  serveAssets = false,
  assetPrefix = defaultAssetPrefix(serveAssets),
  manifestPath,
}: Options = {}): Middleware {
  const getAssetPrefix = (ctx?: Context): string => {
    if (ctx && typeof assetPrefix === 'function') {
      return assetPrefix(ctx);
    } else {
      return <string>assetPrefix;
    }
  };

  async function sewingKitMiddleware(ctx: Context, next: () => Promise<any>) {
    const assets = new Assets({
      assetPrefix: getAssetPrefix(ctx),
      userAgent: ctx.get(Header.UserAgent),
      manifestPath,
    });

    setAssets(ctx, assets);

    await next();
  }

  return serveAssets && getAssetPrefix().startsWith('/')
    ? compose([
        sewingKitMiddleware,
        mount(getAssetPrefix(), serve(join(appRoot.path, 'build/client'))),
      ])
    : sewingKitMiddleware;
}

export const webpackAssetUrl = 'http://localhost:8080/webpack/assets/';

function defaultAssetPrefix(serveAssets: boolean) {
  // In development, Sewing Kit defaults to running an asset server on
  // http://localhost:8080/webpack/assets/. When running in `serveAssets`
  // mode (the application server also serves the assets), we default to
  // assuming they have set the asset endpoint to be under /assets. In order
  // to use this feature, a developer would need to add the following to the
  // Sewing Kit config that built the assets:
  //
  // {
  //   plugins: [plugins.cdn('/assets/')],
  // }
  return serveAssets ? '/assets/' : webpackAssetUrl;
}
