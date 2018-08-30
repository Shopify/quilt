import {Context} from 'koa';
import querystring from 'querystring';
import nonce from 'nonce';

import Error from "./errors";
import {OAuthStartOptions} from '../types';

const createNonce = nonce();

export default function oAuthQueryString(
  ctx: Context,
  options: OAuthStartOptions,
) {
  const {query, host, path, cookies} = ctx;
  const {shop} = query;
  const {scopes = [], apiKey, accessMode} = options;

  if (shop == null) {
    ctx.throw(400, Error.ShopParamMissing);
    return;
  }

  const requestNonce = createNonce();
  cookies.set('shopifyNonce', requestNonce);

  /* eslint-disable camelcase */
  const redirectParams = {
    state: requestNonce,
    scope: scopes.join(', '),
    client_id: apiKey,
    redirect_uri: `https://${host}${path}/callback`,
  };
  /* eslint-enable camelcase */

  if (accessMode === 'online') {
    redirectParams['grant_options[]'] = 'per-user';
  }

  return querystring.stringify(redirectParams);
}
