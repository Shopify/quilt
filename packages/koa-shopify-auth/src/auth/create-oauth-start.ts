import {Context} from 'koa';

import Error from './errors';
import oAuthQueryString from './oauth-query-string';
import {OAuthStartOptions} from '../types';
import {TOP_LEVEL_OAUTH_COOKIE_NAME} from './index';

export default function createOAuthStart(
  options: OAuthStartOptions,
  callbackPath: string,
) {
  return function oAuthStart(ctx: Context) {
    const {myShopifyDomain} = options;
    const {query} = ctx;
    const {shop} = query;

    const shopRegex = new RegExp(
      `^[a-z0-9][a-z0-9\\-]*[a-z0-9]\\.${myShopifyDomain}$`,
      'i',
    );

    if (shop == null || !shopRegex.test(shop)) {
      ctx.throw(400, Error.ShopParamMissing);
      return;
    }

    ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME);

    const formattedQueryString = oAuthQueryString(ctx, options, callbackPath);

    ctx.redirect(
      `https://${shop}/admin/oauth/authorize?${formattedQueryString}`,
    );
  };
}
