import mount from 'koa-mount';
import {createMockContext} from '@shopify/jest-koa-mocks';

import ping from '..';

describe('koa-liveness-ping', () => {
  it('calls next() when path is not `/ping`', async () => {
    const middleware = ping();
    const nextFn = jest.fn();
    const ctx = createMockContext({url: '/some/other/path'});

    await middleware(ctx, nextFn);

    expect(ctx.status).toBe(404);
    expect(nextFn).toHaveBeenCalledTimes(1);
  });

  it('returns with a 200 status when path is `/ping` and does not call next()', async () => {
    const middleware = ping();
    const nextFn = jest.fn();
    const ctx = createMockContext({url: '/ping'});
    await middleware(ctx, nextFn);

    expect(ctx.status).toBe(200);
    expect(nextFn).not.toHaveBeenCalled();
  });

  it('is mountable', async () => {
    const middleware = mount('/services', ping());
    const nextFn = jest.fn();
    const ctx = createMockContext({url: '/services/ping'});
    await middleware(ctx as any, nextFn);

    expect(ctx.status).toBe(200);
    expect(nextFn).not.toHaveBeenCalled();
  });
});
