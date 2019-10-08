import {Server} from 'http';
import Koa, {Context} from 'koa';
import getPort from 'get-port';

import {KoaNextFunction} from '../types';

export class TestRack {
  private servers: Server[] = [];

  unmountAll() {
    this.servers.forEach(server => server.close());
  }

  async mount(
    mountFunction: ({port: number, ip: string}) => Koa,
    options: RequestInit = {},
  ) {
    const port = await getPort();
    const ip = 'http://localhost';
    const server = mountFunction({port, ip});

    return {
      listen: () => {
        return new Promise(resolve => {
          this.servers.push(
            server.listen(port, () => {
              resolve(server);
            }),
          );
        });
      },
      request: () => fetch(`${ip}:${port}`, options).then(response => response),
    };
  }
}

export async function mockMiddleware(_: Context, next: KoaNextFunction) {
  await next();
}
