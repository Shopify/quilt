import {Context} from 'koa';
import querystring from 'querystring';

import {AuthConfig} from './types';
import validateHmac from './validate-hmac';

export const HMAC_INVALID = 'HMAC validation failed';
export const FETCH_ERROR = 'Could not fetch access token';
export const SHOP_PARAM_MISSING = 'Expected a shop query parameter';

export default function createOAuthCallback(config: AuthConfig) {
  return async function oAuthCallback(ctx: Context) {
    const {query} = ctx;
    const {code, hmac, shop} = query;
    const {apiKey, secret, afterAuth} = config;

    if (shop == null) {
      ctx.throw(400, SHOP_PARAM_MISSING);
      return;
    }

    if (validateHmac(hmac, query, secret) === false) {
      ctx.throw(400, HMAC_INVALID);
      return;
    }

    /* eslint-disable camelcase */
    const accessTokenQuery = querystring.stringify({
      code,
      client_id: apiKey,
      client_secret: secret,
    });
    /* eslint-enable camelcase */

    const accessTokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(accessTokenQuery).toString(),
        },
        body: accessTokenQuery,
      },
    );

    if (!accessTokenResponse.ok) {
      ctx.throw(401, FETCH_ERROR);
      return;
    }

    const accessTokenData = await accessTokenResponse.json();
    const {access_token: accessToken} = accessTokenData;

    if (ctx.session) {
      ctx.session.shop = shop;
      ctx.session.accessToken = accessToken;
    }

    ctx.state.shop = shop;
    ctx.state.accessToken = accessToken;

    if (afterAuth) {
      await afterAuth(ctx);
    }
  };
}
