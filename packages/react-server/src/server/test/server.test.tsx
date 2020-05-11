import React from 'react';
import {useTitle} from '@shopify/react-html';
import {useCookie, CookieUniversalProvider} from '@shopify/react-cookie';

import {createServer} from '../server';
import {mockMiddleware, TestRack} from '../../test/utilities';

const rack = new TestRack();

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
  afterAll(() => {
    rack.unmountAll();
  });

  it('starts a server that responds with markup', async () => {
    function MockApp() {
      return <div>markup</div>;
    }

    const wrapper = await rack.mount(({ip, port}) =>
      createServer({port, ip, render: () => <MockApp />}),
    );
    const response = await wrapper.request();

    expect(await response.text()).toStrictEqual(
      `<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="referrer" content="never"/></head><body><div id="app"><div>markup</div></div><script type="text/json" data-serialized-id="quilt-data">undefined</script></body></html>`,
    );
  });

  it('supports updatable meta components', async () => {
    const myTitle = 'Shopify Mock App';

    function MockApp() {
      useTitle(myTitle);
      return null;
    }

    const wrapper = await rack.mount(({ip, port}) =>
      createServer({port, ip, render: () => <MockApp />}),
    );
    const response = await wrapper.request();

    expect(await response.text()).toStrictEqual(
      expect.stringContaining(
        `<title data-react-html="true">${myTitle}</title>`,
      ),
    );
  });

  it('supports getting cookies', async () => {
    const cookie = 'foo';
    const value = 'bar';

    function MockApp() {
      const [cookieValue] = useCookie(cookie);

      return <>{cookieValue}</>;
    }

    const wrapper = await rack.mount(
      ({ip, port}) =>
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
        headers: {
          cookie: `${cookie}=${value}`,
        },
      },
    );

    const response = await wrapper.request();

    expect(await response.text()).toStrictEqual(
      expect.stringContaining(`<div id="app">${value}</div>`),
    );
  });
});
