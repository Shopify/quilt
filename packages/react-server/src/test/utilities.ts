import {Server} from 'http';
import {Context} from 'koa';
import React from 'react';
import getPort from 'get-port';
import request from 'supertest';
import {KoaNextFunction} from '../types';
import {createServer} from '../server';

interface Options {
  port?: number;
  ip?: string;
}

const servers: Server[] = [];

export async function mountAppWithServer(
  app: React.ReactElement<any>,
  options: Options = {},
) {
  const {port = await getPort(), ip = 'http://localhost'} = options;
  const url = `${ip}:${port}`;

  const server = await createServer({
    port,
    ip,
    render: () => app,
  });

  servers.push(server);

  return request(url)
    .get('/')
    .then((resp: request.Response) => {
      return resp;
    });
}

export function stopServers() {
  servers.forEach(server => server.close());
}

export async function mockMiddleware(_: Context, next: KoaNextFunction) {
  await next();
}
