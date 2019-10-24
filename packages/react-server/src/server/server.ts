import 'isomorphic-fetch';
import {Server} from 'http';
import {join} from 'path';
import {existsSync} from 'fs';
import Koa, {Context} from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';
import {middleware as sewingKitMiddleware} from '@shopify/sewing-kit-koa';
import {createRender, RenderFunction} from '../render';
import {requestLogger} from '../logger';
import {metricsMiddleware as metrics} from '../metrics';
import {ping} from '../ping';

const logger = console;

interface Options {
  port?: number;
  ip?: string;
  assetPrefix?: string;
  serverMiddleware?: compose.Middleware<Context>[];
  render: RenderFunction;
}

/**
 * Create a full Koa server for server rendering an `@shopify/react-html` based React application defined by `options.render`
 * @param options
 * @returns a Server instance
 */
export function createServer(options: Options): Server {
  const {port, assetPrefix, render, serverMiddleware, ip} = options;
  const app = new Koa();
  const manifestPath = getManifestPath(process.cwd());

  app.use(mount('/services/ping', ping));

  app.use(requestLogger);
  app.use(metrics);
  app.use(sewingKitMiddleware({assetPrefix, manifestPath}));

  if (serverMiddleware) {
    app.use(compose(serverMiddleware));
  }

  app.use(createRender(render));

  return app.listen(port || 3000, () => {
    logger.log(`started react-server on ${ip}:${port}`);
  });
}

function getManifestPath(root: string) {
  const gemFileExists = existsSync(join(root, 'Gemfile'));
  if (!gemFileExists) {
    return;
  }

  // eslint-disable-next-line no-process-env
  return process.env.NODE_ENV === 'development'
    ? `tmp/sewing-kit/sewing-kit-manifest.json`
    : `public/bundles/sewing-kit-manifest.json`;
}
