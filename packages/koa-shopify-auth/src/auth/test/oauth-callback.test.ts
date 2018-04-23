import querystring from 'querystring';
import {fetch as fetchMock} from '@shopify/jest-dom-mocks';
import {createMockContext} from '@shopify/jest-koa-mocks';

import createOAuthCallback from '../create-oauth-callback';
import {AuthConfig} from '../../types';
import Error from '../errors';

jest.mock('../validate-hmac', () => jest.fn(() => true));
const validateHmac = require.requireMock('../validate-hmac');

const baseConfig: AuthConfig = {
  apiKey: 'myapikey',
  secret: 'mysecret',
};

const nonce = 'totallyrealnonce';

const queryData = {
  state: nonce,
  shop: 'shop1.myshopify.io',
  hmac: 'abc',
  code: 'def',
};

const baseUrl = 'myapp.com/auth/callback';

// eslint-disable-next-line camelcase
const basicResponse = {status: 200, body: {access_token: 'made up token'}};

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
    fetchMock.mock('*', basicResponse);

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: baseUrl,
      throw: jest.fn(),
    });

    oAuthCallback(ctx);

    expect(ctx.throw).toBeCalledWith(400, Error.ShopParamMissing);
  });

  it('throws a 400 if the hmac is invalid', async () => {
    fetchMock.mock('*', basicResponse);

    validateHmac.mockImplementation(() => false);

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      throw: jest.fn(),
    });

    await oAuthCallback(ctx);

    expect(validateHmac).toBeCalled();
    expect(ctx.throw).toBeCalledWith(400, Error.InvalidHMAC);
  });

  it('throws a 403 if no nonce cookie is provided', () => {
    fetchMock.mock('*', basicResponse);

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      throw: jest.fn(),
    });

    oAuthCallback(ctx);

    expect(ctx.throw).toBeCalledWith(403, Error.NonceMatchFailed);
  });

  it('throws a 403 if no nonce query is present', () => {
    fetchMock.mock('*', basicResponse);

    const oAuthCallback = createOAuthCallback(baseConfig);

    const query = querystring.stringify({
      ...queryData,
      nonce: null,
    });

    const ctx = createMockContext({
      url: `${baseUrl}?${query}`,
      throw: jest.fn(),
    });

    oAuthCallback(ctx);

    expect(ctx.throw).toBeCalledWith(403, Error.NonceMatchFailed);
  });

  it('throws a 403 if the nonce query param does not match the cookie', () => {
    fetchMock.mock('*', basicResponse);

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      throw: jest.fn(),
      cookies: {
        nonce: 'incorrect',
      },
    });

    oAuthCallback(ctx);

    expect(ctx.throw).toBeCalledWith(403, Error.NonceMatchFailed);
  });

  it('throws a 403 if the nonce query param does not match the cookie', () => {
    fetchMock.mock('*', basicResponse);

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      throw: jest.fn(),
      cookies: {
        nonce: 'incorrect',
      },
    });

    oAuthCallback(ctx);

    expect(ctx.throw).toBeCalledWith(403, Error.NonceMatchFailed);
  });

  it('does not throw a 400 when hmac is valid and shop parameter is supplied', async () => {
    fetchMock.mock('*', basicResponse);

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      throw: jest.fn(),
    });

    await oAuthCallback(ctx);

    expect(ctx.throw).not.toBeCalledWith(400, Error.ShopParamMissing);
    expect(ctx.throw).not.toBeCalledWith(400, Error.InvalidHMAC);
  });

  it("fetches an access token with the app's credentials", async () => {
    // eslint-disable-next-line camelcase
    fetchMock.mock('*', {status: 200, body: {access_token: 'abc'}});

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      cookies: {shopifyNonce: nonce},
    });

    await oAuthCallback(ctx);

    const {secret, apiKey} = baseConfig;
    const {code} = queryData;

    expect(fetchMock.lastCall()).toEqual([
      'https://shop1.myshopify.io/admin/oauth/access_token',
      {
        body: querystring.stringify({
          code,
          // eslint-disable-next-line camelcase
          client_id: apiKey,
          // eslint-disable-next-line camelcase
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
    // eslint-disable-next-line camelcase
    fetchMock.mock('*', {status: 401, body: {access_token: 'abc'}});

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      throw: jest.fn(),
    });

    await oAuthCallback(ctx);

    expect(ctx.throw).toBeCalledWith(401, Error.AccessTokenFetchFailure);
  });

  it('includes the shop and accessToken on session if the token request succeeds and session exists', async () => {
    const accessToken = 'abc';

    // eslint-disable-next-line camelcase
    fetchMock.mock('*', {status: 200, body: {access_token: accessToken}});

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      session: {},
      cookies: {shopifyNonce: nonce},
    });

    await oAuthCallback(ctx);

    expect(ctx.session).toMatchObject({
      shop: queryData.shop,
      accessToken,
    });
  });

  it('includes the shop and accesstoken on state if the token request succeeds', async () => {
    const accessToken = 'abc';

    // eslint-disable-next-line camelcase
    fetchMock.mock('*', {status: 200, body: {access_token: accessToken}});

    const oAuthCallback = createOAuthCallback(baseConfig);
    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      session: {},
      cookies: {shopifyNonce: nonce},
    });

    await oAuthCallback(ctx);

    expect(ctx.state.shopify).toMatchObject({
      shop: queryData.shop,
      accessToken,
    });
  });

  it('calls afterAuth with ctx when the token request succeeds', async () => {
    const afterAuth = jest.fn();

    // eslint-disable-next-line camelcase
    fetchMock.mock('*', {status: 200, body: {access_token: 'abc'}});

    const oAuthCallback = createOAuthCallback({
      ...baseConfig,
      afterAuth,
    });

    const ctx = createMockContext({
      url: `${baseUrl}?${querystring.stringify(queryData)}`,
      cookies: {shopifyNonce: nonce},
    });

    await oAuthCallback(ctx);

    expect(afterAuth).toBeCalledWith(ctx);
  });
});
