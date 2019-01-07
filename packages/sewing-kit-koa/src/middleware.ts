import {join} from 'path';
import {Context} from 'koa';
import serve from 'koa-static';
import compose from 'koa-compose';
import mount from 'koa-mount';
import appRoot from 'app-root-path';

import {Header} from '@shopify/network';

import Assets, {Asset} from './assets';

export {Assets, Asset};

export interface State {
  assets: Assets;
}

export interface Options {
  assetPrefix?: string;
  serveAssets?: boolean;
}

export default function middleware({
  serveAssets = false,
  assetPrefix = defaultAssetPrefix(serveAssets),
}: Options = {}) {
  async function sewingKitMiddleware(ctx: Context, next: () => Promise<any>) {
    const assets = new Assets({
      assetPrefix,
      userAgent: ctx.get(Header.UserAgent),
    });
    ctx.state.assets = assets;
    await next();
  }

  return serveAssets && assetPrefix.startsWith('/')
    ? compose([
        sewingKitMiddleware,
        mount(assetPrefix, serve(join(appRoot.path, 'build/client'))),
      ])
    : sewingKitMiddleware;
}

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
  return serveAssets ? '/assets/' : 'http://localhost:8080/webpack/assets/';
}
