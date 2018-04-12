import querystring from 'querystring';
import {fetch as fetchMock} from '@shopify/jest-dom-mocks';
import {createMockContext} from '@shopify/jest-koa-mocks';

import createOAuthCallback, {
  HMAC_INVALID,
  SHOP_PARAM_MISSING,
  FETCH_ERROR,
} from '../create-oauth-callback';
import {AuthConfig} from '../types';

jest.mock('../validate-hmac', () => jest.fn(() => true));
const validateHmac = require.requireMock('../validate-hmac');

const baseConfig: AuthConfig = {
  apiKey: 'myapikey',
  secret: 'mysecret',
};

const queryData = {
  shop: 'shop1.myshopify.io',
  hmac: 'abc',
  code: 'def',
};

const baseUrl = 'myapp.com/auth/callback';

describe('OAuthCallback', () => {
  beforeEach(() => {
    validateHmac.mockReset();
    validateHmac.mockImplementation(() => true);
  });

  afterEach(async () => {
    await fetchMock.flush();
    fetchMock.restore();
  });

  it('throws a 400 if the shop query parameter is not present', () => {
    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: baseUrl,
      throw: jest.fn(),
    });

    oAuthCallback(ctx);

    expect(ctx.throw).toBeCalledWith(400, SHOP_PARAM_MISSING);
  });

  it('throws a 400 if the hmac is invalid', async () => {
    validateHmac.mockImplementation(() => false);

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      throw: jest.fn(),
    });

    await oAuthCallback(ctx);

    expect(validateHmac).toBeCalled();
    expect(ctx.throw).toBeCalledWith(400, HMAC_INVALID);
  });

  it('does not throw a 400 when hmac is valid and shop parameter is supplied', async () => {
    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      throw: jest.fn(),
    });

    await oAuthCallback(ctx);

    expect(ctx.throw).not.toBeCalledWith(
      400,
      'Expected a shop query parameter',
    );
    expect(ctx.throw).not.toBeCalledWith(400, HMAC_INVALID);
  });

  it('fetches an access token with the apps credentials', async () => {
    // eslint-disable-next-line
    fetchMock.mock('*', {status: 200, body: {access_token: 'abc'}});

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
    });

    await oAuthCallback(ctx);

    const {secret, apiKey} = baseConfig;
    const {code} = queryData;

    expect(fetchMock.lastCall()).toEqual([
      'https://shop1.myshopify.io/admin/oauth/access_token',
      {
        body: querystring.stringify({
          code,
          // eslint-disable-next-line
          client_id: apiKey,
          // eslint-disable-next-line
          client_secret: secret,
        }),
        headers: {
          'Content-Length': '50',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
      },
    ]);
  });

  it('throws a 401 if the token request fails', async () => {
    // eslint-disable-next-line
    fetchMock.mock('*', {status: 401, body: {access_token: 'abc'}});

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      throw: jest.fn(),
    });

    await oAuthCallback(ctx);

    expect(ctx.throw).toBeCalledWith(401, FETCH_ERROR);
  });

  it('includes the shop and accessToken on session if the token request succeeds and session exists', async () => {
    const accessToken = 'abc';

    // eslint-disable-next-line
    fetchMock.mock('*', {status: 200, body: {access_token: accessToken}});

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      session: {},
    });

    await oAuthCallback(ctx);

    expect(ctx.session).toMatchObject({
      shop: queryData.shop,
      accessToken,
    });
  });

  it('includes the shop and accesstoken on state if the token request succeeds', async () => {
    const accessToken = 'abc';

    // eslint-disable-next-line
    fetchMock.mock('*', {status: 200, body: {access_token: accessToken}});

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      session: {},
    });

    await oAuthCallback(ctx);

    expect(ctx.state).toMatchObject({
      shop: queryData.shop,
      accessToken,
    });
  });

  it('calls afterAuth with ctx when the token request succeeds', async () => {
    const afterAuth = jest.fn();

    // eslint-disable-next-line
    fetchMock.mock('*', {status: 200, body: {access_token: 'abc'}});

    const oAuthCallback = createOAuthCallback({
      ...baseConfig,
      afterAuth,
    });
    const ctx = createMockContext({
      url: `myapp.com/auth?shop=shop1.myshopify.io&hmac=noreal&code=nothing`,
    });

    await oAuthCallback(ctx);

    expect(afterAuth).toBeCalledWith(ctx);
  });
});
