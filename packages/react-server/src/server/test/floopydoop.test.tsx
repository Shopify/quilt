import React from 'react';
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
});
