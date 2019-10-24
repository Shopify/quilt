import {Server} from 'http';
import {AddressInfo} from 'net';
import {URL} from 'url';

import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import getPort from 'get-port';

export class AppServer {
  private readonly port: number;

  constructor(private readonly server: Server) {
    this.port = (server.address() as AddressInfo).port;
  }

  url(path = '') {
    return new URL(path, `http://localhost:${this.port} `);
  }

  assetUrl(path = '') {
    return this.url(`/assets/${path}`);
  }

  terminate() {
    return new Promise((resolve, reject) => {
      this.server.close(error => {
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

  app.use(mount('/assets', serve(servePath)));
  app.use(
    mount('/', ctx => {
      ctx.body = `
        <html>
          <body><script type="text/javascript" src="/assets/main.js"></script></body>
        </html>
      `;
    }),
  );

  const port = await getPort();

  return new Promise<AppServer>(resolve => {
    const server = app.listen(port, () => {
      resolve(new AppServer(server));
    });
  });
}
