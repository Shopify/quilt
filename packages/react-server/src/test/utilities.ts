import {Server} from 'http';

import fetch from 'cross-fetch';
import {Context} from 'koa';
import getPort from 'get-port';

import {KoaNextFunction} from '../types';

export class TestRack {
  private servers: Server[] = [];

  unmountAll() {
    this.servers.forEach(server => server.close());
  }

  async mount(
    mountFunction: ({port: number, ip: string}) => Server,
    options: RequestInit = {},
  ) {
    const port = await getPort();
    const ip = 'http://localhost';
    const server = mountFunction({port, ip});

    this.servers.push(server);

    return {
      request: () => fetch(`${ip}:${port}`, options).then(response => response),
    };
  }
}

export async function mockMiddleware(_: Context, next: KoaNextFunction) {
  await next();
}
