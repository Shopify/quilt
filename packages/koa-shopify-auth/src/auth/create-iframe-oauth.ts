import {Context} from 'koa';

import {OAuthStartOptions} from '../types';
import oAuthQueryString from './oauth-query-string';

export default function createIFrameOAuth(options: OAuthStartOptions) {
  return function iFrameOAuth(ctx: Context) {
    const {query} = ctx;
    const {shop} = query;

    const formattedQueryString = oAuthQueryString(ctx, options);

    // TODO: Validate that the shop is legal
    ctx.redirect(`https://${shop}/admin/oauth/authorize?${formattedQueryString}`);
  };
}
