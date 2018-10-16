import * as Koa from 'koa';
import * as session from 'koa-session';
import {preloadAll} from '@shopify/async-chunks';
import {AsyncChunks} from '@shopify/async-chunks/server';
import {resolve} from 'path';
import {ip, port} from '../config/server';
import renderApp from './render-app';

const app = new Koa();

app.use(session(app));

// set session ID
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  const manifest = resolve(__dirname, '../build/client/async-chunks.json');
  ctx.state.asyncChunks = new AsyncChunks(manifest);
  await next();
});

app.use(renderApp);

preloadAll()
  .then(() => {
    app.listen(port, ip, () => {
      // eslint-disable-next-line no-console
      console.log(`[init] listening on ${ip}:${port}`);
    });
  })
  // eslint-disable-next-line no-console
  .catch((error: any) => console.log('Error: ', error));

export default app;
