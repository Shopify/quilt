import {Server} from 'http';
import React from 'react';
import request from 'supertest';
import getPort from 'get-port';

import {createServer} from '../../server';
import {mockMiddleware} from '../../test/utilities';

jest.mock('@shopify/sewing-kit-koa', () => ({
  middleware: jest.fn(() => mockMiddleware),
  getAssets() {
    return {
      styles: () => Promise.resolve([]),
      scripts: () => Promise.resolve([]),
    };
  },
}));

describe('createServer()', () => {
  let server: Server;
  let port: number;
  const ip = 'http://localhost';

  beforeEach(async () => {
    port = await getPort();

    server = await createServer({
      port,
      ip,
      render: () => <div>Mock app</div>,
    });
  });

  afterEach(() => {
    server.close();
  });

  it('responds with a Server-Timing header', async () => {
    const response = await request(`${ip}:${port}`)
      .get('/')
      .then((resp: request.Response) => resp);

    expect(response.header['server-timing']).toBeDefined();
  });
});
