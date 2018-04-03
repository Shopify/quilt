import {Context} from 'koa';
import querystring from 'querystring';
import crypto from 'crypto';

import {AuthConfig} from './types';

export default function createOAuthCallback(config: AuthConfig) {
  return async function oAuthCallback(ctx: Context) {
    const {query} = ctx;
    const {code, hmac, shop} = query;

    const map = {...query};
    delete map.signature;
    delete map.hmac;

    const message = querystring.stringify(map);
    const generatedHash = crypto
      .createHmac('sha256', config.secret)
      .update(message)
      .digest('hex');

    if (generatedHash !== hmac) {
      ctx.throw(400, 'HMAC validation failed');
      return;
    }

    if (shop == null) {
      ctx.throw(400, 'Expected a shop query parameter');
      return;
    }

    /* eslint-disable camelcase */
    const accessTokenQuery = querystring.stringify({
      code,
      client_id: config.apiKey,
      client_secret: config.secret,
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
      ctx.throw(401, 'Could not fetch access token');
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

    await config.afterAuth(ctx);
  };
}
