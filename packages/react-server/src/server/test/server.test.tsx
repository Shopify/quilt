import React from 'react';
import Koa from 'koa';
import {useTitle} from '@shopify/react-html';
import {useCookie, CookieUniversalProvider} from '@shopify/react-cookie';
import {saddle, unsaddle} from 'saddle-up';

import {mockMiddleware} from '../../test/utilities';
import {createServer} from '../server';

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
  afterAll(unsaddle);

  it('configurable as koa proxy', async () => {
    function MockApp() {}
    const app = new Koa();

    const wrapper = await saddle((port, host) =>
      createServer({
        app,
        proxy: true,
        port,
        ip: host,
        render: () => <MockApp />,
      }),
    );

    expect(app.proxy).toBe(true);
  });

  it('starts a server that responds with markup', async () => {
    function MockApp() {
      return <div>markup</div>;
    }

    const wrapper = await saddle((port, host) =>
      createServer({port, ip: host, render: () => <MockApp />}),
    );

    const response = await wrapper.fetch('/');

    await expect(response).toHaveBodyText(
      `<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="referrer" content="never"/></head><body><div id="app"><div>markup</div></div><script type="text/json" data-serialized-id="quilt-data">undefined</script></body></html>`,
    );
  });

  it('supports updatable meta components', async () => {
    const myTitle = 'Shopify Mock App';

    function MockApp() {
      useTitle(myTitle);
      return null;
    }

    const wrapper = await saddle((port, ip) =>
      createServer({port, ip, render: () => <MockApp />}),
    );
    const response = await wrapper.fetch('/');

    await expect(response).toHaveBodyText(
      `<title data-react-html="true">${myTitle}</title>`,
    );
  });

  it('supports getting cookies', async () => {
    const cookieName = 'foo';
    const value = 'bar';

    function MockApp() {
      const [cookieValue] = useCookie(cookieName);

      return <>{cookieValue}</>;
    }

    const wrapper = await saddle(
      (port, ip) =>
        createServer({
          port,
          ip,
          render: () => (
            <CookieUniversalProvider server>
              <MockApp />
            </CookieUniversalProvider>
          ),
        }),
      {
        cookies: {
          [cookieName]: value,
        },
      },
    );

    const response = await wrapper.fetch('/');

    expect(response).toHaveBodyText(`<div id="app">${value}</div>`);
  });

  describe('ip', () => {
    it('uses process.env.REACT_SERVER_IP for host if ip is not pass in', async () => {
      const mockIP = 'localhost';
      /* eslint-disable no-process-env */
      const oldReactServerIP = process.env.REACT_SERVER_IP;
      process.env.REACT_SERVER_IP = mockIP;

      function MockApp() {}
      const app = new Koa();
      const spy = jest.spyOn(app, 'listen');

      await saddle(port =>
        createServer({app, port, render: () => <MockApp />}),
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Number),
        mockIP,
        expect.any(Function),
      );
      process.env.REACT_SERVER_IP = oldReactServerIP;
      /* eslint-enable no-process-env */
    });

    it('uses 0.0.0.0 for host if ip is not pass in and process.env.REACT_SERVER_IP is undefined', async () => {
      /* eslint-disable no-process-env */
      const oldReactServerIP = process.env.REACT_SERVER_IP;
      process.env.REACT_SERVER_IP = undefined;

      function MockApp() {}
      const app = new Koa();
      const spy = jest.spyOn(app, 'listen');

      const wrapper = await saddle(port =>
        createServer({app, port, render: () => <MockApp />}),
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(Number),
        '0.0.0.0',
        expect.any(Function),
      );
      process.env.REACT_SERVER_IP = oldReactServerIP;
      /* eslint-enable no-process-env */
    });
  });

  describe('port', () => {
    it('uses process.env.REACT_SERVER_PORT for host if ip is not pass in', async () => {
      const mockPort = '7070';
      /* eslint-disable no-process-env */
      const oldReactServerPort = process.env.REACT_SERVER_PORT;
      process.env.REACT_SERVER_PORT = mockPort;

      function MockApp() {}
      const app = new Koa();
      const spy = jest.spyOn(app, 'listen');

      await saddle((_port, host) =>
        createServer({app, ip: host, render: () => <MockApp />}),
      );

      expect(spy).toHaveBeenCalledWith(
        parseInt(mockPort, 10),
        expect.any(String),
        expect.any(Function),
      );
      process.env.REACT_SERVER_PORT = oldReactServerPort;
      /* eslint-enable no-process-env */
    });

    it('uses 8081 for host if ip is not pass in and process.env.REACT_SERVER_IP is undefined', async () => {
      /* eslint-disable no-process-env */
      const oldReactServerPort = process.env.REACT_SERVER_PORT;
      process.env.REACT_SERVER_PORT = undefined;

      function MockApp() {}
      const app = new Koa();
      const spy = jest.spyOn(app, 'listen');

      const wrapper = await saddle((_port, host) =>
        createServer({app, ip: host, render: () => <MockApp />}),
      );

      expect(spy).toHaveBeenCalledWith(
        8081,
        expect.any(String),
        expect.any(Function),
      );
      process.env.REACT_SERVER_PORT = oldReactServerPort;
      /* eslint-enable no-process-env */
    });
  });
});
