import {createMockContext} from '@shopify/jest-koa-mocks';
import {fetch} from '@shopify/jest-dom-mocks';
import verifyRequest from '../verify-request';
import {TEST_COOKIE_NAME, TOP_LEVEL_OAUTH_COOKIE_NAME} from '../../index';

describe('verifyRequest', () => {
  afterEach(fetch.restore);
  it('calls next if there is an accessToken on session', async () => {
    const verifyRequestMiddleware = verifyRequest();
    const ctx = createMockContext({
      session: {accessToken: 'test', shop: 'testshop.myshopify.com'},
    });
    const next = jest.fn();

    fetch.mock('https://testshop.myshopify.com/admin/metafields.json', 200);
    await verifyRequestMiddleware(ctx, next);

    expect(next).toHaveBeenCalled();
  });

  it('clears the top level oauth cookie if there is an accessToken', () => {
    const verifyRequestMiddleware = verifyRequest();
    const ctx = createMockContext({session: {accessToken: 'test'}});
    const next = jest.fn();

    verifyRequestMiddleware(ctx, next);

    expect(ctx.cookies.set).toHaveBeenCalledWith(TOP_LEVEL_OAUTH_COOKIE_NAME);
  });

  it('sets the test cookie if there is no accessToken', () => {
    const verifyRequestMiddleware = verifyRequest();
    const ctx = createMockContext();
    const next = jest.fn();

    verifyRequestMiddleware(ctx, next);

    expect(ctx.cookies.set).toHaveBeenCalledWith(TEST_COOKIE_NAME, '1');
  });

  it('redirects to /auth if there is no accessToken but shop is present on query', () => {
    const shop = 'myshop.com';

    const verifyRequestMiddleware = verifyRequest();
    const next = jest.fn();
    const ctx = createMockContext({
      url: `/foo?shop=${shop}`,
      redirect: jest.fn(),
    });

    verifyRequestMiddleware(ctx, next);

    expect(ctx.redirect).toHaveBeenCalledWith(`/auth?shop=${shop}`);
  });

  it('redirects to the /auth when there is no accessToken or known shop', () => {
    const verifyRequestMiddleware = verifyRequest();

    const next = jest.fn();
    const ctx = createMockContext({
      redirect: jest.fn(),
    });

    verifyRequestMiddleware(ctx, next);

    expect(ctx.redirect).toHaveBeenCalledWith('/auth');
  });

  it('redirects to given authRoute if there is no accessToken but shop is present on query', () => {
    const shop = 'myshop.com';
    const authRoute = '/my-auth-route';

    const verifyRequestMiddleware = verifyRequest({authRoute});
    const next = jest.fn();
    const ctx = createMockContext({
      url: `/foo?shop=${shop}`,
      redirect: jest.fn(),
    });

    verifyRequestMiddleware(ctx, next);

    expect(ctx.redirect).toHaveBeenCalledWith(`${authRoute}?shop=${shop}`);
  });

  it('redirects to given authRoute if existing token is invalid', async () => {
    const shop = 'myshop.com';
    const authRoute = '/my-auth-route';

    const verifyRequestMiddleware = verifyRequest({authRoute});
    const next = jest.fn();
    const ctx = createMockContext({
      url: `/foo?shop=${shop}`,
      redirect: jest.fn(),
      session: {accessToken: 'test', shop: 'testshop.myshopify.com'},
    });

    fetch.mock('https://testshop.myshopify.com/admin/metafields.json', 401);
    await verifyRequestMiddleware(ctx, next);

    expect(ctx.redirect).toHaveBeenCalledWith(`${authRoute}?shop=${shop}`);
  });

  it('redirects to the given fallbackRoute when there is no accessToken or known shop', () => {
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
