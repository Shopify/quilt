import {Server} from 'http';
import {AddressInfo} from 'net';
import {URL} from 'url';

import Koa, {Middleware, Context} from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import getPort from 'get-port';

export class AppServer {
  private readonly port: number;

  constructor(
    private readonly server: Server,
    private readonly middlewares: Set<Middleware>,
  ) {
    this.port = (server.address() as AddressInfo).port;
  }

  use(middleware: Middleware) {
    this.middlewares.add(middleware);
  }

  url(path = '') {
    return new URL(path, `http://localhost:${this.port} `);
  }

  assetUrl(path = '') {
    return this.url(`/assets/${path}`);
  }

  terminate() {
    return new Promise<void>((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

export async function createServer({serve: servePath}: {serve: string}) {
  const app = new Koa();
  const middlewares = new Set<Middleware>();

  app.use((ctx, next) => {
    if (middlewares.size === 0) {
      return next();
    }

    const finalMiddlewares = [...middlewares];

    function runMiddleware(index = 0): Promise<void> {
      return finalMiddlewares[index](
        ctx,
        index === finalMiddlewares.length - 1
          ? next
          : () => runMiddleware(index + 1),
      );
    }

    return runMiddleware();
  });

  app.use(mount('/assets', serve(servePath)));
  app.use(
    mount('/', (ctx: Context) => {
      ctx.body = `
        <html>
          <body><script type="text/javascript" src="/assets/main.js"></script></body>
        </html>
      `;
    }),
  );

  const port = await getPort();

  return new Promise<AppServer>((resolve) => {
    const server = app.listen(port, () => {
      resolve(new AppServer(server, middlewares));
    });
  });
}
