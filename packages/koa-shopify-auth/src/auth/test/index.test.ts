import {createMockContext} from '@shopify/jest-koa-mocks';

import createShopifyAuth from '../index';
import createTopLevelOAuthRedirect from '../create-top-level-oauth-redirect';
import createEnableCookiesRedirect from '../create-enable-cookies-redirect';
import createRequestStorage from '../create-request-storage';
import {OAuthStartOptions} from '../../types';

const mockTopLevelOAuthRedirect = jest.fn();
jest.mock('../create-top-level-oauth-redirect', () =>
  jest.fn(() => mockTopLevelOAuthRedirect),
);

const mockEnableCookiesRedirect = jest.fn();
jest.mock('../create-enable-cookies-redirect', () =>
  jest.fn(() => mockEnableCookiesRedirect),
);

const mockRequestStorage = jest.fn();
jest.mock('../create-request-storage', () => jest.fn(() => mockRequestStorage));

const mockOAuthStart = jest.fn();
jest.mock('../create-oauth-start', () => () => mockOAuthStart);

const mockOAuthCallback = jest.fn();
jest.mock('../create-oauth-callback', () => () => mockOAuthCallback);

const mockEnableCookies = jest.fn();
jest.mock('../create-enable-cookies', () => () => mockEnableCookies);

const baseUrl = 'myapp.com/auth';

const baseConfig: OAuthStartOptions = {
  apiKey: 'myapikey',
  appName: 'test app',
  scopes: ['write_orders, write_products'],
  accessMode: 'offline',
  secret: '',
};

function nextFunction() {}

function createPartitionedContext(path = '', cookies = {}) {
  return createMockContext({
    url: `https://${baseUrl}${path}`,
    headers: {'user-agent': 'Version/12.0.1 Safari'},
    cookies,
  });
}

function createNonPartitionedContext(path = '', cookies = {}) {
  return createMockContext({
    url: `https://${baseUrl}${path}`,
    headers: {'user-agent': 'Version/12.1.0 Safari'},
    cookies,
  });
}

function createNonITPContext(path = '', cookies = {}) {
  return createMockContext({
    url: `https://${baseUrl}${path}`,
    headers: {'user-agent': 'OtherBrowser'},
    cookies,
  });
}

function createShopifyMobileContext(path = '', cookies = {}) {
  return createMockContext({
    url: `https://${baseUrl}${path}`,
    headers: {'user-agent': 'Shopify Mobile/iOS'},
    cookies,
  });
}

function createShopifyPOSContext(path = '', cookies = {}) {
  return createMockContext({
    url: `https://${baseUrl}${path}`,
    headers: {'user-agent': 'com.jadedpixel.pos'},
    cookies,
  });
}

describe('Index', () => {
  describe('with the /auth path', () => {
    describe('non-itp agent with no test cookie', () => {
      it('redirects to enable cookies', async () => {
        const shopifyAuth = createShopifyAuth(baseConfig);
        const ctx = createNonITPContext();

        await shopifyAuth(ctx, nextFunction);

        expect(createTopLevelOAuthRedirect).toBeCalledWith('/auth/inline');
        expect(mockTopLevelOAuthRedirect).toBeCalledWith(ctx);
      });
    });

    describe('partitioned ITP agent with no test cookie', () => {
      it('redirects to enable cookies', async () => {
        const shopifyAuth = createShopifyAuth(baseConfig);
        const ctx = createPartitionedContext();

        await shopifyAuth(ctx, nextFunction);

        expect(createEnableCookiesRedirect).toHaveBeenCalledWith(
          'myapikey',
          '/auth/enable_cookies',
        );
        expect(mockEnableCookiesRedirect).toHaveBeenCalledWith(ctx);
      });
    });

    describe('non-partitioned ITP agent with no test cookie', () => {
      it('redirects to enable cookies', async () => {
        const shopifyAuth = createShopifyAuth(baseConfig);
        const ctx = createNonPartitionedContext();

        await shopifyAuth(ctx, nextFunction);

        expect(createRequestStorage).toBeCalled();
        expect(mockRequestStorage).toBeCalledWith(ctx);
      });
    });

    describe('with a test cookie but not top-level cookie', () => {
      it('redirects to /auth/inline at the top-level', async () => {
        const shopifyAuth = createShopifyAuth(baseConfig);
        const ctx = createPartitionedContext('', {
          'shopify.granted_storage_access': '1',
        });

        await shopifyAuth(ctx, nextFunction);

        expect(createTopLevelOAuthRedirect).toHaveBeenCalledWith(
          'myapikey',
          '/auth/inline',
        );
        expect(mockTopLevelOAuthRedirect).toHaveBeenCalledWith(ctx);
      });
    });

    it('state is set', async () => {
      const shopifyAuth = createShopifyAuth(baseConfig);
      const ctx = createNonITPContext();

      await shopifyAuth(ctx, nextFunction);

      expect(ctx.state.apiKey).toEqual(baseConfig.apiKey);
      expect(ctx.state.appName).toEqual(baseConfig.appName);
      expect(ctx.state.authRoute).toEqual('/auth');
    });

    describe('with a test cookie and a top-level cookie', () => {
      it('performs inline oauth', async () => {
        const shopifyAuth = createShopifyAuth(baseConfig);
        const ctx = createPartitionedContext('', {
          'shopify.granted_storage_access': '1',
          'shopify.top_level_oauth': '1',
        });

        await shopifyAuth(ctx, nextFunction);

        expect(mockOAuthStart).toHaveBeenCalledWith(ctx);
      });
    });
  });

  describe('OAuth routes', () => {
    const contexts = {
      'Non ITP': createNonITPContext,
      'Non-Partitioned': createNonPartitionedContext,
      Partitioned: createPartitionedContext,
      'Shopify Mobile': createShopifyMobileContext,
      'Shopify POS': createShopifyPOSContext,
    };
    for (const [description, createContext] of Object.entries(contexts)) {
      /* eslint-disable no-loop-func */
      describe(`with ${description} agent`, () => {
        describe('with the /auth/inline path', () => {
          it('performs inline oauth', async () => {
            const shopifyAuth = createShopifyAuth(baseConfig);
            const ctx = createContext('/inline');

            await shopifyAuth(ctx, nextFunction);

            expect(mockOAuthStart).toBeCalledWith(ctx);
          });
        });

        describe('with the /auth/callback path', () => {
          it('performs oauth callback', async () => {
            const shopifyAuth = createShopifyAuth(baseConfig);
            const ctx = createContext('/callback');

            await shopifyAuth(ctx, nextFunction);

            expect(mockOAuthCallback).toBeCalledWith(ctx);
          });
        });

        describe('with the /auth/enable_cookies path', () => {
          it('renders the enable_cookies page', async () => {
            const shopifyAuth = createShopifyAuth(baseConfig);
            const ctx = createContext('/enable_cookies');

            await shopifyAuth(ctx, nextFunction);

            expect(mockEnableCookies).toBeCalledWith(ctx);
          });
        });
      });
    }
  });
});
