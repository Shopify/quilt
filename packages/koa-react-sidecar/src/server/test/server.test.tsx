import {Server} from 'http';
import React from 'react';
import request from 'supertest';
import {createServer} from '../server';

describe('createServer()', () => {
  function MockApp() {
    return <div>markup</div>;
  }

  const port = 4443;

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

    expect(response.text).toBe(
      `<html lang="en" data-reactroot=""><head><meta charSet="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="referrer" content="never"/></head><body><div id="app"><div>markup</div></div></body></html>`,
    );
  });
});
