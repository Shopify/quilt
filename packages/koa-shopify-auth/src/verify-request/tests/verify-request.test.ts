import {createMockContext} from '@shopify/jest-koa-mocks';
import verifyRequest from '../verify-request';

describe('verifyRequest', () => {
  it('calls next if there is an accessToken on session', () => {
    const verifyRequestMiddleware = verifyRequest();
    const ctx = createMockContext({session: {accessToken: 'test'}});
    const next = jest.fn();

    verifyRequestMiddleware(ctx, next);

    expect(next).toBeCalled();
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

    expect(ctx.redirect).toBeCalledWith(`/auth?shop=${shop}`);
  });

  it('redirects to the /auth when there is no accessToken or known shop', () => {
    const verifyRequestMiddleware = verifyRequest();

    const next = jest.fn();
    const ctx = createMockContext({
      redirect: jest.fn(),
    });

    verifyRequestMiddleware(ctx, next);

    expect(ctx.redirect).toBeCalledWith('/auth');
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

    expect(ctx.redirect).toBeCalledWith(`${authRoute}?shop=${shop}`);
  });

  it('redirects to the given fallbackRoute when there is no accessToken or known shop', () => {
    const fallbackRoute = '/somewhere-on-the-app';
    const verifyRequestMiddleware = verifyRequest({fallbackRoute});

    const next = jest.fn();
    const ctx = createMockContext({
      redirect: jest.fn(),
    });

    verifyRequestMiddleware(ctx, next);

    expect(ctx.redirect).toBeCalledWith(fallbackRoute);
  });
});
