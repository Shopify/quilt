import React from 'react';
import {useTitle} from '@shopify/react-html';
import {useCookie, CookieUniversalProvider} from '@shopify/react-cookie';
import {
  useServerCookie,
  useRequestHeader,
  Header,
} from '@shopify/react-network';
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
      `<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="referrer" content="never"/></head><body><div id="app"><div>markup</div></div></body></html>`,
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

  it('supports getting headers', async () => {
    function MockApp() {
      const header = useRequestHeader(Header.UserAgent);
      return <div>{header}</div>;
    }

    const wrapper = await rack.mount(({ip, port}) =>
      createServer({port, ip, render: () => <MockApp />}),
    );
    const response = await wrapper.request();

    expect(await response.text()).toStrictEqual(
      expect.stringContaining(`node-fetch`),
    );
  });

  it('can get and set server cookies', async () => {
    const cookie = 'foo';
    const value = 'bar';

    function MockApp() {
      const [serverCookieValue, setServerCookie] = useServerCookie(cookie);
      setServerCookie(value);

      return <>{serverCookieValue}</>;
    }

    const wrapper = await rack.mount(({ip, port}) =>
      createServer({
        port,
        ip,
        render: () => (
          <CookieUniversalProvider>
            <MockApp />
          </CookieUniversalProvider>
        ),
      }),
    );
    const response = await wrapper.request();

    expect(await response.text()).toStrictEqual(
      expect.stringContaining(`<div id="app">${value}</div>`),
    );
  });

  it('can get and set universal cookies', async () => {
    const cookie = 'foo';
    const value = 'bar';

    function MockApp() {
      const [_, setServerCookie] = useServerCookie(cookie);
      setServerCookie(value);
      const [cookieValue] = useCookie(cookie);

      return <>{cookieValue}</>;
    }

    const wrapper = await rack.mount(({ip, port}) =>
      createServer({
        port,
        ip,
        render: () => (
          <CookieUniversalProvider>
            <MockApp />
          </CookieUniversalProvider>
        ),
      }),
    );
    const response = await wrapper.request();

    expect(await response.text()).toStrictEqual(
      expect.stringContaining(`<div id="app">${value}</div>`),
    );
  });
});
