import 'cross-fetch';
import {Server} from 'http';

import Koa, {Context} from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';

import {createRender, RenderFunction, RenderOptions} from '../render';
import {requestLogger} from '../logger';
import {metricsMiddleware as metrics} from '../metrics';
import {ping} from '../ping';

const logger = console;

interface Options {
  ip?: string;
  port?: number;
  assetPrefix?: string;
  proxy?: boolean;
  assetName?: RenderOptions['assetName'];
  htmlProps?: RenderOptions['htmlProps'];
  serverMiddleware?: compose.Middleware<Context>[];
  render: RenderFunction;
  renderError?: RenderOptions['renderError'];
  renderRawErrorMessage?: boolean;
  app?: Koa;
}

/**
 * Create a full Koa server for server rendering an `@shopify/react-html` based React application defined by `options.render`
 * @param options
 * @returns a Server instance
 */
export function createServer(options: Options): Server {
  const {
    /* eslint-disable no-process-env */
    ip = process.env.REACT_SERVER_IP &&
    process.env.REACT_SERVER_IP !== 'undefined'
      ? process.env.REACT_SERVER_IP
      : '0.0.0.0',
    port = process.env.REACT_SERVER_PORT &&
    process.env.REACT_SERVER_PORT !== 'undefined'
      ? parseInt(process.env.REACT_SERVER_PORT, 10)
      : 8081,
    // a default is set in sewingKitMiddleware
    assetPrefix = process.env.CDN_URL && process.env.CDN_URL !== 'undefined'
      ? process.env.CDN_URL
      : undefined,
    /* eslint-enable no-process-env */
    render,
    renderError,
    renderRawErrorMessage = process.env.NODE_ENV === 'development',
    serverMiddleware,
    assetName,
    htmlProps,
    proxy = false,
    app = new Koa(),
  } = options;

  app.proxy = proxy;

  app.use(mount('/services/ping', ping));

  app.use(requestLogger);
  app.use(metrics);

  if (serverMiddleware) {
    app.use(compose(serverMiddleware));
  }

  app.use(
    createRender(render, {assetPrefix, assetName, renderError, renderRawErrorMessage, htmlProps}),
  );

  return app.listen(port, ip, () => {
    logger.log(`started react-server on ${ip}:${port}`);
  });
}
