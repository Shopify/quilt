import {createMockContext} from '@shopify/jest-koa-mocks';
import {noCache, Header} from '@shopify/network';
import {noopNext} from '../..';
import {disableCaching} from '../cache';

describe('disableCaching()', () => {
  it('adds the no-cache Cache-Control Header', async () => {
    const set = jest.fn();
    const context = createMockContext({customProperties: {set}});

    await disableCaching(context, noopNext);

    expect(context.set).toHaveBeenCalledWith(Header.CacheControl, noCache);
  });
});
