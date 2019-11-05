import {createMockContext} from '@shopify/jest-koa-mocks';
import {fetch} from '@shopify/jest-dom-mocks';
import {StatusCode} from '@shopify/network';

import verifyRequest from '../verify-request';
import {TEST_COOKIE_NAME, TOP_LEVEL_OAUTH_COOKIE_NAME} from '../../index';

const TEST_SHOP = 'testshop.myshopify.com';

describe('verifyRequest', () => {
  afterEach(fetch.restore);

  describe('when there is an accessToken and shop in session', () => {
    it('calls next', async () => {
      const verifyRequestMiddleware = verifyRequest();
      const ctx = createMockContext({
        url: appUrl(TEST_SHOP),
        session: {accessToken: 'test', shop: TEST_SHOP},
      });
      const next = jest.fn();

      fetch.mock(metaFieldsUrl(TEST_SHOP), StatusCode.Ok);
      await verifyRequestMiddleware(ctx, next);

      expect(next).toHaveBeenCalled();
    });

    it('calls next when there is no shop in the query', async () => {
      const verifyRequestMiddleware = verifyRequest();
      const ctx = createMockContext({
        url: appUrl(),
        session: {accessToken: 'test', shop: TEST_SHOP},
      });
      const next = jest.fn();

      fetch.mock(metaFieldsUrl(TEST_SHOP), StatusCode.Ok);
      await verifyRequestMiddleware(ctx, next);

      expect(next).toHaveBeenCalled();
    });

    it('clears the top level oauth cookie', () => {
      const verifyRequestMiddleware = verifyRequest();
      const ctx = createMockContext({
        url: appUrl(TEST_SHOP),
        session: {shop: TEST_SHOP, accessToken: 'test'},
      });
      const next = jest.fn();

      verifyRequestMiddleware(ctx, next);

      expect(ctx.cookies.set).toHaveBeenCalledWith(TOP_LEVEL_OAUTH_COOKIE_NAME);
    });

    it('redirects to the given authRoute if the token is invalid', async () => {
      const authRoute = '/my-auth-route';

      const verifyRequestMiddleware = verifyRequest({authRoute});
      const next = jest.fn();
      const ctx = createMockContext({
        url: appUrl(TEST_SHOP),
        redirect: jest.fn(),
        session: {accessToken: 'test', shop: TEST_SHOP},
      });

      fetch.mock(metaFieldsUrl(TEST_SHOP), StatusCode.Unauthorized);
      await verifyRequestMiddleware(ctx, next);

      expect(ctx.redirect).toHaveBeenCalledWith(
        `${authRoute}?shop=${TEST_SHOP}`,
      );
    });

    it('redirects to the given authRoute if the shop in session does not match the one in the query param', async () => {
      const authRoute = '/my-auth-route';

      const verifyRequestMiddleware = verifyRequest({authRoute});
      const next = jest.fn();
      const ctx = createMockContext({
        url: appUrl(TEST_SHOP),
        redirect: jest.fn(),
        session: {accessToken: 'test', shop: 'some-other-shop.com'},
      });

      fetch.mock(metaFieldsUrl(TEST_SHOP), StatusCode.Ok);
      await verifyRequestMiddleware(ctx, next);

      expect(ctx.redirect).toHaveBeenCalledWith(
        `${authRoute}?shop=${TEST_SHOP}`,
      );
    });
  });

  describe('when there is no session', () => {
    it('sets the test cookie', () => {
      const verifyRequestMiddleware = verifyRequest();
      const ctx = createMockContext({});
      const next = jest.fn();

      verifyRequestMiddleware(ctx, next);

      expect(ctx.cookies.set).toHaveBeenCalledWith(TEST_COOKIE_NAME, '1');
    });

    it('redirects to /auth if shop is present on query', () => {
      const shop = 'myshop.com';

      const verifyRequestMiddleware = verifyRequest();
      const next = jest.fn();
      const ctx = createMockContext({
        url: appUrl(shop),
        redirect: jest.fn(),
      });

      verifyRequestMiddleware(ctx, next);

      expect(ctx.redirect).toHaveBeenCalledWith(`/auth?shop=${shop}`);
    });

    it('redirects to /auth if shop is not present on query', () => {
      const verifyRequestMiddleware = verifyRequest();
      const next = jest.fn();
      const ctx = createMockContext({
        url: appUrl(),
        redirect: jest.fn(),
      });

      verifyRequestMiddleware(ctx, next);

      expect(ctx.redirect).toHaveBeenCalledWith(`/auth`);
    });

    it('redirects to the given authRoute if shop is present on query', () => {
      const shop = 'myshop.com';
      const authRoute = '/my-auth-route';

      const verifyRequestMiddleware = verifyRequest({authRoute});
      const next = jest.fn();
      const ctx = createMockContext({
        url: appUrl(shop),
        redirect: jest.fn(),
      });

      verifyRequestMiddleware(ctx, next);

      expect(ctx.redirect).toHaveBeenCalledWith(`${authRoute}?shop=${shop}`);
    });

    it('redirects to the given fallbackRoute if shop is not present on query', () => {
      const fallbackRoute = '/somewhere-on-the-app';
      const verifyRequestMiddleware = verifyRequest({fallbackRoute});

      const next = jest.fn();
      const ctx = createMockContext({
        redirect: jest.fn(),
      });

      verifyRequestMiddleware(ctx, next);

      expect(ctx.redirect).toHaveBeenCalledWith(fallbackRoute);
    });
  });
});

function metaFieldsUrl(shop: string) {
  return `https://${shop}/admin/metafields.json`;
}

function appUrl(shop?: string) {
  return shop == null ? '/foo' : `/foo?shop=${shop}`;
}
