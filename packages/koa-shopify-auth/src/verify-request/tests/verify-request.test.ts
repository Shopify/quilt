import {createMockContext} from '@shopify/jest-koa-mocks';
import createVerifyRequest from '../create-verify-request';

describe('verifyRequest', () => {
  it('calls next if there is an accessToken on session', () => {
    const verifyRequest = createVerifyRequest();
    const ctx = createMockContext({session: {accessToken: 'test'}});
    const next = jest.fn();

    verifyRequest(ctx, next);

    expect(next).toBeCalled();
  });

  it('redirects to /auth if there is no accessToken but shop is present on query', () => {
    const shop = 'myshop.com';

    const verifyRequest = createVerifyRequest();
    const next = jest.fn();
    const ctx = createMockContext({
      url: `/foo?shop=${shop}`,
      redirect: jest.fn(),
    });

    verifyRequest(ctx, next);

    expect(ctx.redirect).toBeCalledWith(`/auth?shop=${shop}`);
  });

  it('redirects to the /install when there is no accessToken or known shop', () => {
    const verifyRequest = createVerifyRequest();

    const next = jest.fn();
    const ctx = createMockContext({
      redirect: jest.fn(),
    });

    verifyRequest(ctx, next);

    expect(ctx.redirect).toBeCalledWith('/install');
  });

  it('redirects to given authRoute if there is no accessToken but shop is present on query', () => {
    const shop = 'myshop.com';
    const authRoute = '/my-auth-route';

    const verifyRequest = createVerifyRequest({authRoute});
    const next = jest.fn();
    const ctx = createMockContext({
      url: `/foo?shop=${shop}`,
      redirect: jest.fn(),
    });

    verifyRequest(ctx, next);

    expect(ctx.redirect).toBeCalledWith(`${authRoute}?shop=${shop}`);
  });

  it('redirects to the given fallbackRoute when there is no accessToken or known shop', () => {
    const fallbackRoute = '/somewhere-on-the-app';
    const verifyRequest = createVerifyRequest({fallbackRoute});

    const next = jest.fn();
    const ctx = createMockContext({
      redirect: jest.fn(),
    });

    verifyRequest(ctx, next);

    expect(ctx.redirect).toBeCalledWith(fallbackRoute);
  });
});
