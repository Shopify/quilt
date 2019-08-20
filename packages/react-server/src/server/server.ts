import 'isomorphic-fetch';
import {Server} from 'http';
import {join} from 'path';
import {pathExistsSync} from 'fs-extra';
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

/**
 * Create a full Koa server for server rendering an `@shopify/react-html` based React application defined by `options.render`
 * @param options
 * @returns a Server instance
 */
export function createServer(options: Options): Server {
  const {port, assetPrefix, render, debug, serverMiddleware, ip} = options;
  const app = new Koa();
  const manifestPath = getManifestPath(process.cwd());

  app.use(mount('/services/ping', ping));

  app.use(createLogger({level: debug ? Verbosity.Debug : Verbosity.Off}));
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
  const gemFileExists = pathExistsSync(join(root, 'Gemfile'));
  if (!gemFileExists) {
    return;
  }

  // eslint-disable-next-line no-process-env
  return process.env.NODE_ENV === 'development'
    ? `tmp/sewing-kit/sewing-kit-manifest.json`
    : `public/bundles/sewing-kit-manifest.json`;
}
