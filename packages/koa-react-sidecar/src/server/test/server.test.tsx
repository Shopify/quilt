import {Server} from 'http';
import React from 'react';
import request from 'supertest';
import {createServer} from '../server';

describe('createServer()', () => {
  function MockApp() {
    return <div>markup</div>;
  }

  const port = 4444;

  let server: Server;

  beforeEach(async () => {
    server = await createServer({
      port,
      render: () => <MockApp />,
    });
  });

  afterEach(() => {
    server.close();
  });

  it('starts a server that responds with markup', async () => {
    const response = await request(`http://localhost:${port}`)
      .get('/')
      .then((resp: request.Response) => {
        return resp;
      });

    expect(response).toMatchObject(
      expect.objectContaining({
        text: '<div data-reactroot="">markup</div>',
      }),
    );
  });
});
