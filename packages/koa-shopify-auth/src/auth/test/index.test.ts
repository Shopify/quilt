import {createMockContext} from '@shopify/jest-koa-mocks';

import createShopifyAuth from '../index';

import createCookieRedirect from '../create-cookie-redirect';
import {OAuthStartOptions, Cookies} from '../../types';

const mockCookiesRedirect = jest.fn();
jest.mock('../create-cookie-redirect', () =>
  jest.fn(() => mockCookiesRedirect),
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

        expect(createCookieRedirect).toBeCalledWith(
          '/auth/enable_cookies',
          Cookies.test,
        );
        expect(mockCookiesRedirect).toBeCalledWith(ctx);
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

        expect(createCookieRedirect).toBeCalledWith(
          '/auth/inline',
          Cookies.topLevel,
        );
        expect(mockCookiesRedirect).toBeCalledWith(ctx);
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
