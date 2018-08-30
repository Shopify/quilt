import {Context} from 'koa';

import {OAuthStartOptions} from '../types';
import oAuthQueryString from './oauth-query-string';
import redirectionPage from './redirection-page';

export default function createTopLevelOAuth(options: OAuthStartOptions) {
  return function topLevelOAuth(ctx: Context) {
    const {query} = ctx;
    const {shop} = query;

    const formattedQueryString = oAuthQueryString(ctx, options);
    ctx.body = redirectionPage({
      origin: `https://${shop}`,
      redirectTo: `/admin/oauth/authorize?${formattedQueryString}`,
    });
  };
}
