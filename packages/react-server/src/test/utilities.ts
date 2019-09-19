import {Server} from 'http';
import {Context} from 'koa';
import request from 'supertest';
import getPort from 'get-port';
import {KoaNextFunction} from '../types';

export class TestRack {
  private servers: Server[] = [];
  unmountAll() {
    this.servers.forEach(server => server.close());
  }

  async mount(mountFunction: ({port: number, ip: string}) => Server) {
    const port = await getPort();
    const ip = 'http://localhost';
    const server = mountFunction({port, ip});

    this.servers.push(server);

    return {
      request: (url: string) => request(`${ip}:${port}`).get(url),
    };
  }
}

export async function mockMiddleware(_: Context, next: KoaNextFunction) {
  await next();
}
