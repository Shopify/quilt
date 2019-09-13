import {Method, StatusCode} from '@shopify/network';
import {createMockContext} from '@shopify/jest-koa-mocks';
import {secureRequest} from '../secure-request';

describe('secureRequest()', () => {
  it('redirects insecure requests', async () => {
    const insecureUrl = 'http://snowdevil.myshopify.com';
    const context = createMockContext({url: insecureUrl});
    const next = jest.fn();

    await secureRequest(context, next);

    expect(context.redirect).toHaveBeenCalled();
    expect(context.status).toBe(StatusCode.MovedPermanently);
    expect(next).not.toHaveBeenCalled();
  });

  it('does not redirect secure requests', async () => {
    const secureUrl = 'https://snowdevil.myshopify.com';
    const context = createMockContext({url: secureUrl});
    const next = jest.fn();

    await secureRequest(context, next);

    expect(context.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('does not redirect PUT requests', async () => {
    const context = createMockContext({method: Method.Put});
    const next = jest.fn();

    await secureRequest(context, next);

    expect(context.redirect).not.toHaveBeenCalled();
    expect(context.status).toBe(StatusCode.Forbidden);
    expect(context.body).toMatchObject({
      error: 'This server only accepts requests via HTTPS.',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
