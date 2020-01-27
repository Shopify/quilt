import querystring from 'querystring';

import {createMockContext} from '@shopify/jest-koa-mocks';

import createTopLevelRedirect from '../create-top-level-redirect';
import redirectionPage from '../redirection-page';

const query = querystring.stringify.bind(querystring);
const baseUrl = 'myapp.com/auth';
const path = '/path';
const shop = 'shop1.myshopify.io';
const shopOrigin = 'shop1.myshopify.io';
const apiKey = 'fakekey';

describe('TopLevelRedirect', () => {
  it('redirects to the provided path with shop parameter', () => {
    const topLevelRedirect = createTopLevelRedirect(apiKey, path);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    topLevelRedirect(ctx);

    expect(ctx.body).toBe(
      redirectionPage({
        redirectTo: `https://myapp.com/path?${query({shop})}`,
        origin: shopOrigin,
        apiKey,
      }),
    );
  });
});
