import querystring from 'querystring';
import {Context} from 'koa';

import redirectionPage from './redirection-page';

export default function createTopLevelRedirect(path: string) {
  return function topLevelRedirect(ctx: Context) {
    const {host, query} = ctx;
    const {shop} = query;

    const params = {shop};
    const queryString = querystring.stringify(params);

    ctx.body = redirectionPage({
      origin: `https://${shop}`,
      redirectTo: `https://${host}${path}?${queryString}`,
    });
  };
}
