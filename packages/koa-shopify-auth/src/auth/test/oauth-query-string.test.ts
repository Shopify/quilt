import querystring from 'querystring';
import {createMockContext} from '@shopify/jest-koa-mocks';

import oAuthQueryString from '../oauth-query-string';

jest.mock('nonce', () => {
  const fakeFactory = jest.fn();
  return () => fakeFactory;
});
const nonce = require.requireMock('nonce');

const query = querystring.stringify.bind(querystring);
const fakeNonce = 'fakenonce';
const baseUrl = 'myapp.com/auth';
const callbackPath = '/auth/callback';
const shop = 'shop1.myshopify.io';

const baseConfig = {
  apiKey: 'myapikey',
  secret: 'mysecret',
  scopes: ['write_orders, write_products'],
};

const queryData = {
  state: fakeNonce,
  scope: 'write_orders, write_products',
  // eslint-disable-next-line camelcase
  client_id: baseConfig.apiKey,
  // eslint-disable-next-line camelcase
  redirect_uri: `https://${baseUrl}/callback`,
};

describe('oAuthQueryString', () => {
  beforeEach(() => {
    const mockedNonce = nonce();

    mockedNonce.mockImplementation(() => fakeNonce);
  });

  it('returns a valid query string', () => {
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    const generatedQueryString = oAuthQueryString(
      ctx,
      baseConfig,
      callbackPath,
    );

    expect(generatedQueryString).toBe(query(queryData));
  });

  it('sets nonce cookie', () => {
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    oAuthQueryString(ctx, baseConfig, callbackPath);

    expect(ctx.cookies.set).toBeCalledWith('shopifyNonce', fakeNonce);
  });

  it('query string includes per-user grant for accessMode: online', () => {
    const ctx = createMockContext({
      url: 'https://myapp.com/auth?shop=shop1.myshopify.io',
    });

    const generatedQueryString = oAuthQueryString(
      ctx,
      {...baseConfig, accessMode: 'online'},
      callbackPath,
    );

    // eslint-disable-next-line camelcase
    const grantQuery = query({...queryData, 'grant_options[]': 'per-user'});
    expect(generatedQueryString).toBe(grantQuery);
  });
});
