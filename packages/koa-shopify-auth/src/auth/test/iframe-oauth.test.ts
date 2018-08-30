import querystring from 'querystring';
import {createMockContext} from '@shopify/jest-koa-mocks';

import createIFrameOAuth from '../create-iframe-oauth';
import redirectionPage from '../redirection-page';

import oAuthQueryString from '../oauth-query-string';
jest.mock('../oauth-query-string', () => ({
  default: jest.fn(),
  __esModule: true,
}));

const query = querystring.stringify.bind(querystring);
const baseUrl = 'myapp.com/auth';
const shop = 'shop1.myshopify.io';
const shopOrigin = 'https://shop1.myshopify.io';
const redirectionURL = `/admin/oauth/authorize`;

const baseConfig = {
  apiKey: 'myapikey',
  scopes: ['write_orders, write_products'],
  accessMode: 'offline',
};

describe('IFrameOAuth', () => {
  it('redirects to redirectionURL with the returned query string', () => {
    const oAuthStart = createIFrameOAuth(baseConfig);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    oAuthQueryString.mockReturnValue('abc=123');

    oAuthStart(ctx);

    expect(oAuthQueryString).toBeCalledWith(ctx, baseConfig);
    expect(ctx.redirect).toBeCalledWith(`https://${shop}${redirectionURL}?abc=123`);
  });
});
