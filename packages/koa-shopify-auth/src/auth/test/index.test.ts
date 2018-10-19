import {createMockContext} from '@shopify/jest-koa-mocks';

import createShopifyAuth from '../index';

import createTopLevelOAuthRedirect from '../create-top-level-oauth-redirect';
import createEnableCookiesRedirect from '../create-enable-cookies-redirect';
import {OAuthStartOptions} from '../../types';

const mockTopLevelOAuthRedirect = jest.fn();
jest.mock('../create-top-level-oauth-redirect', () =>
  jest.fn(() => mockTopLevelOAuthRedirect),
);

const mockEnableCookiesRedirect = jest.fn();
jest.mock('../create-enable-cookies-redirect', () =>
  jest.fn(() => mockEnableCookiesRedirect),
);

const mockOAuthStart = jest.fn();
jest.mock('../create-oauth-start', () => () => mockOAuthStart);

const mockOAuthCallback = jest.fn();
jest.mock('../create-oauth-callback', () => () => mockOAuthCallback);

const mockEnableCookies = jest.fn();
jest.mock('../create-enable-cookies', () => () => mockEnableCookies);

const baseUrl = 'myapp.com/auth';

const baseConfig: OAuthStartOptions = {
  apiKey: 'myapikey',
  scopes: ['write_orders, write_products'],
  accessMode: 'offline',
  secret: '',
};

function nextFunction() {}

describe('Index', () => {
  describe('with the /auth path', () => {
    describe('with no test cookie', () => {
      it('redirects to enable cookies', async () => {
        const shopifyAuth = createShopifyAuth(baseConfig);
        const ctx = createMockContext({
          url: `https://${baseUrl}`,
        });

        await shopifyAuth(ctx, nextFunction);

        expect(createEnableCookiesRedirect).toBeCalledWith(
          '/auth/enable_cookies',
        );
        expect(mockEnableCookiesRedirect).toBeCalledWith(ctx);
      });
    });

    describe('with a test cookie but not top-level cookie', () => {
      it('redirects to /auth/inline at the top-level', async () => {
        const shopifyAuth = createShopifyAuth(baseConfig);
        const ctx = createMockContext({
          url: `https://${baseUrl}`,
          cookies: {shopifyTestCookie: '1'},
        });

        await shopifyAuth(ctx, nextFunction);

        expect(createTopLevelOAuthRedirect).toBeCalledWith('/auth/inline');
        expect(mockTopLevelOAuthRedirect).toBeCalledWith(ctx);
      });
    });

    describe('with a test cookie and a top-level cookie', () => {
      it('performs inline oauth', async () => {
        const shopifyAuth = createShopifyAuth(baseConfig);
        const ctx = createMockContext({
          url: `https://${baseUrl}`,
          cookies: {shopifyTestCookie: '1', shopifyTopLevelOAuth: '1'},
        });

        await shopifyAuth(ctx, nextFunction);

        expect(mockOAuthStart).toBeCalledWith(ctx);
      });
    });
  });

  describe('with the /auth/inline path', () => {
    it('performs inline oauth', async () => {
      const shopifyAuth = createShopifyAuth(baseConfig);
      const ctx = createMockContext({
        url: `https://${baseUrl}/inline`,
      });

      await shopifyAuth(ctx, nextFunction);

      expect(mockOAuthStart).toBeCalledWith(ctx);
    });
  });

  describe('with the /auth/callback path', () => {
    it('performs oauth callback', async () => {
      const shopifyAuth = createShopifyAuth(baseConfig);
      const ctx = createMockContext({
        url: `https://${baseUrl}/callback`,
      });

      await shopifyAuth(ctx, nextFunction);

      expect(mockOAuthCallback).toBeCalledWith(ctx);
    });
  });

  describe('with the /auth/enable_cookies path', () => {
    it('renders the enable_cookies page', async () => {
      const shopifyAuth = createShopifyAuth(baseConfig);
      const ctx = createMockContext({
        url: `https://${baseUrl}/enable_cookies`,
      });

      await shopifyAuth(ctx, nextFunction);

      expect(mockEnableCookies).toBeCalledWith(ctx);
    });
  });
});
