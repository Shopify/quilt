import querystring from 'querystring';
import {createMockContext} from '@shopify/jest-koa-mocks';

import createOAuthStart from '../create-oauth-start';
import redirectionPage from '../redirection-page';
import Error from '../errors';

import oAuthQueryString from '../oauth-query-string';

jest.mock('../oauth-query-string', () => ({
  default: jest.fn(),
  __esModule: true,
}));

const query = querystring.stringify.bind(querystring);
const baseUrl = 'myapp.com/auth';
const callbackPath = '/callback';
const shop = 'sho-p1.myshopify.io';
const badShop = 'shop1myshopify.io';
const shopOrigin = 'https://shop1.myshopify.io';
const redirectionURL = `/admin/oauth/authorize`;

const baseConfig = {
  apiKey: 'myapikey',
  scopes: ['write_orders, write_products'],
  accessMode: 'offline',
  myShopifyDomain: 'myshopify.io',
};

describe('OAuthStart', () => {
  it('throws a 400 when no shop query parameter is given', () => {
    const oAuthStart = createOAuthStart(baseConfig, callbackPath);
    const ctx = createMockContext({
      url: `https://${baseUrl}`,
      throw: jest.fn(),
    });

    oAuthStart(ctx);

    expect(ctx.throw).toBeCalledWith(400, Error.ShopParamMissing);
  });

  it('throws a 400 when an invalid shop query parameter is given', () => {
    const oAuthStart = createOAuthStart(baseConfig, callbackPath);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({badShop})}`,
      throw: jest.fn(),
    });

    oAuthStart(ctx);

    expect(ctx.throw).toBeCalledWith(400, Error.ShopParamMissing);
  });

  it('clears the top-level cookie', () => {
    const oAuthStart = createOAuthStart(baseConfig, callbackPath);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    oAuthQueryString.mockReturnValue('abc=123');

    oAuthStart(ctx);

    expect(ctx.cookies.set).toBeCalledWith('shopifyTopLevelOAuth');
  });

  it('redirects to redirectionURL with the returned query string', () => {
    const oAuthStart = createOAuthStart(baseConfig, callbackPath);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    oAuthQueryString.mockReturnValue('abc=123');

    oAuthStart(ctx);

    expect(oAuthQueryString).toBeCalledWith(ctx, baseConfig, callbackPath);
    expect(ctx.redirect).toBeCalledWith(
      `https://${shop}${redirectionURL}?abc=123`,
    );
  });
});
