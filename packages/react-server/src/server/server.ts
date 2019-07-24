import 'isomorphic-fetch';
import {Server} from 'http';

import Koa, {Context} from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';
import {middleware as sewingKitMiddleware} from '@shopify/sewing-kit-koa';
import {createRender, RenderFunction} from '../render';
import {createLogger, Verbosity} from '../logger';
import {ping} from '../ping';

const logger = console;

type Options = {
  port?: number;
  ip?: string;
  assetPrefix?: string;
  serverMiddleware?: compose.Middleware<Context>[];
  render: RenderFunction;
  debug?: boolean;
};

export function createServer(options: Options): Server {
  const {port, assetPrefix, render, debug, serverMiddleware, ip} = options;
  const app = new Koa();

  const manifestPath =
    process.env.NODE_ENV === 'development'
      ? `tmp/sewing-kit/sewing-kit-manifest.json`
      : `public/bundles/sewing-kit-manifest.json`;

  app.use(mount('/services/ping', ping));

  app.use(createLogger({level: debug ? Verbosity.Debug : Verbosity.Off}));
  app.use(sewingKitMiddleware({assetPrefix, manifestPath}));

  if (serverMiddleware) {
    app.use(compose(serverMiddleware));
  }

  app.use(createRender(render));

  return app.listen(port || 3000, () => {
    logger.log(`started sidecar server on ${ip}:${port}`);
  });
}
