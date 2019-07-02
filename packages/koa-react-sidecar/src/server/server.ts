import {Server} from 'http';
import Koa from 'koa';
import {createRender, RenderContext} from '../render';

const logger = console;

interface Options {
  port?: number;
  render: (ctx: RenderContext) => React.ReactElement;
}

export function createServer(options: Options): Server {
  const {port, render} = options;
  const app = new Koa();

  app.use(createRender(render));

  return app.listen(port || 3000, () => {
    logger.log(`started sidecar server on ${port}`);
  });
}
