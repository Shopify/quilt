import querystring from 'querystring';

import {createMockContext} from '@shopify/jest-koa-mocks';

import createTopLevelOAuthRedirect from '../create-top-level-oauth-redirect';
import createTopLevelRedirect from '../create-top-level-redirect';

const mockTopLevelRedirect = jest.fn();
jest.mock('../create-top-level-redirect', () =>
  jest.fn(() => mockTopLevelRedirect),
);

const query = querystring.stringify.bind(querystring);
const baseUrl = 'myapp.com/auth';
const shop = 'shop1.myshopify.io';
const path = '/auth/inline';
const apiKey = 'somekey';

describe('CreateTopLevelOAuthRedirect', () => {
  it('sets the test cookie', () => {
    const topLevelOAuthRedirect = createTopLevelOAuthRedirect(apiKey, path);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    topLevelOAuthRedirect(ctx);

    expect(ctx.cookies.set).toHaveBeenCalledWith(
      'shopifyTopLevelOAuth',
      '1',
      {},
    );
  });

  it('sets up and calls the top level redirect', () => {
    const topLevelOAuthRedirect = createTopLevelOAuthRedirect(apiKey, path);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    topLevelOAuthRedirect(ctx);

    expect(createTopLevelRedirect).toHaveBeenCalledWith(apiKey, path);
    expect(mockTopLevelRedirect).toHaveBeenCalledWith(ctx);
  });
});
