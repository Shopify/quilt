import querystring from 'querystring';
import {createMockContext} from '@shopify/jest-koa-mocks';

import createCookieRedirect from '../create-cookie-redirect';
import createTopLevelRedirect from '../create-top-level-redirect';
import {Cookies} from '../../types';

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
    const enableCookiesRedirect = createCookieRedirect(path, Cookies.test);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    enableCookiesRedirect(ctx);

    expect(ctx.cookies.set).toBeCalledWith('shopifyTestCookie', '1');
  });

  it("redirects to cookie path if we can't set cookies and the user agent supports cookie partitioning", () => {
    const enableCookiesRedirect = createCookieRedirect(path, Cookies.test);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
      headers: {
        'user-agent': 'Version/12.0.1 Safari',
      },
    });

    enableCookiesRedirect(ctx);

    expect(createTopLevelRedirect).toBeCalledWith(path);
    expect(mockTopLevelRedirect).toBeCalledWith(ctx);
  });

  it('renders the request storage route if we do not have storage access', () => {
    const enableCookiesRedirect = createCookieRedirect(path, Cookies.test);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
      cookies: {},
    });

    enableCookiesRedirect(ctx);

    expect(createTopLevelRedirect).toBeCalledWith(path);
    expect(mockTopLevelRedirect).toBeCalledWith(ctx);
  });
});
