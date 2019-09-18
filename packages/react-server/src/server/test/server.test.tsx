import React from 'react';
import {useTitle} from '@shopify/react-html';
import {useAcceptLanguage} from '@shopify/react-network';
import {
  mockMiddleware,
  stopServers,
  mountAppWithServer,
} from '../../test/utilities';

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
    stopServers();
  });

  it('starts a server that responds with markup', async () => {
    function MockApp() {
      return <div>markup</div>;
    }

    const response = await mountAppWithServer(<MockApp />);

    expect(response.text).toBe(
      `<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="referrer" content="never"/></head><body><div id="app"><div>markup</div></div></body></html>`,
    );
  });

  it('supports updatable meta components', async () => {
    const myTitle = 'Shopify Mock App';

    function MockApp() {
      useTitle(myTitle);
      return null;
    }

    const response = await mountAppWithServer(<MockApp />);

    expect(response.text).toStrictEqual(
      expect.stringContaining(
        `<title data-react-html="true">${myTitle}</title>`,
      ),
    );
  });

  it('supports setting a custom locale', async () => {
    const language = 'it';

    function MockApp() {
      const [lang] = useAcceptLanguage({code: language, quality: 1});
      const markup = `The accept language header is ${lang.code}`;
      return <div>{markup}</div>;
    }

    const response = await mountAppWithServer(<MockApp />);

    expect(response.text).toStrictEqual(
      expect.stringContaining(`The accept language header is ${language}`),
    );
  });
});
