import querystring from 'querystring';
import {createMockContext} from '@shopify/jest-koa-mocks';

import createEnableCookiesRedirect from '../create-enable-cookies-redirect';
import createTopLevelRedirect from '../create-top-level-redirect';

const mockTopLevelRedirect = jest.fn();
jest.mock('../create-top-level-redirect', () =>
  jest.fn(() => mockTopLevelRedirect),
);

const query = querystring.stringify.bind(querystring);
const baseUrl = 'myapp.com/auth';
const shop = 'shop1.myshopify.io';
const path = '/auth/enable_cookies';

describe('CreateEnableCookiesRedirect', () => {
  it('sets the test cookie', () => {
    const enableCookiesRedirect = createEnableCookiesRedirect(path);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    enableCookiesRedirect(ctx);

    expect(ctx.cookies.set).toBeCalledWith('shopifyTestCookie', '1');
  });

  it('sets up and calls the top level redirect', () => {
    const enableCookiesRedirect = createEnableCookiesRedirect(path);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    enableCookiesRedirect(ctx);

    expect(createTopLevelRedirect).toBeCalledWith(path);
    expect(mockTopLevelRedirect).toBeCalledWith(ctx);
  });
});
