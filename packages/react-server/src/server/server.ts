import 'cross-fetch';
import {Server} from 'http';

import Koa, {Context} from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';

import {createRender, RenderFunction} from '../render';
import {requestLogger} from '../logger';
import {metricsMiddleware as metrics} from '../metrics';
import {ping} from '../ping';
import {ValueFromContext, KoaNextFunction} from '../types';
import {fallbackErrorMarkup} from '../render/error';

const logger = console;

interface Options {
  port?: number;
  ip?: string;
  assetPrefix?: string;
  assetName?: string | ValueFromContext<string>;
  serverMiddleware?: compose.Middleware<Context>[];
  render: RenderFunction;
  renderError?: RenderFunction;
}

/**
 * Create a full Koa server for server rendering an `@shopify/react-html` based React application defined by `options.render`
 * @param options
 * @returns a Server instance
 */
export function createServer(options: Options): Server {
  const {
    port,
    assetPrefix,
    render,
    serverMiddleware,
    ip,
    assetName,
    renderError,
  } = options;
  const app = new Koa();

  app.use(mount('/services/ping', ping));

  app.use(
    mount('/webpack/assets/dll/vendor.js', async function middleware(
      ctx: Context,
      next: KoaNextFunction,
    ) {
      // eslint-disable-next-line no-process-env
      if (process.env.NODE_ENV === 'development') {
        console.log('!!! HERE !!!');
        ctx.body = fallbackErrorMarkup;
        ctx.set('Content-Type', 'text/html');
      } else {
        await next();
      }
    }),
  );

  app.use(requestLogger);
  app.use(metrics);

  if (serverMiddleware) {
    app.use(compose(serverMiddleware));
  }

  app.use(createRender(render, {assetPrefix, assetName, renderError}));

  return app.listen(port || 3000, () => {
    logger.log(`started react-server on ${ip}:${port}`);
  });
}
