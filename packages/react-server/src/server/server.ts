import 'isomorphic-fetch';
import {Server} from 'http';
import Koa, {Context} from 'koa';
import compose from 'koa-compose';
import {middleware as sewingKitMiddleware} from '@shopify/sewing-kit-koa';
import {createRender, RenderFunction} from '../render';
import {createLogger, Verbosity} from '../logger';

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

  app.use(sewingKitMiddleware({assetPrefix}));
  app.use(createLogger({level: debug ? Verbosity.Debug : Verbosity.Off}));

  if (serverMiddleware) {
    app.use(compose(serverMiddleware));
  }

  app.use(createRender(render));

  return app.listen(port || 3000, () => {
    logger.log(`started sidecar server on ${ip}:${port}`);
  });
}
