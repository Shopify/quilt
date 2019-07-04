import 'isomorphic-fetch';
import {Server} from 'http';
import Koa from 'koa';
import {middleware as sewingKitMiddleware} from '@shopify/sewing-kit-koa';
import {createRender, CreateRenderOptions} from '../render';
import {createLogger} from '../logger';

const logger = console;

type Options = {
  port?: number;
} & CreateRenderOptions;

export function createServer(options: Options): Server {
  const {port, render, graphQLClientOptions} = options;
  const app = new Koa();

  app.use(sewingKitMiddleware());
  app.use(createLogger());
  app.use(createRender({graphQLClientOptions, render}));

  return app.listen(port || 3000, () => {
    logger.log(`started sidecar server on ${port}`);
  });
}
