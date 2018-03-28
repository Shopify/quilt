import {Context} from 'koa';
import querystring from 'querystring';

import {Options, NextFunction} from './types';

export default function createOAuthStart({
  scopes,
  apiKey,
  prefix,
  accessMode,
}: Options) {
  return function(ctx: Context, next: NextFunction) {
    const {query, originalUrl} = ctx;
    const {shop} = query;

    if (shop == null) {
      ctx.throw(400, 'shop parameter required');
      return;
    }

    /* eslint-disable camelcase */
    const redirectParams = {
      baseUrl: prefix,
      scope: scopes,
      client_id: apiKey,
      redirect_uri: `${originalUrl}/callback`,
    };
    /* eslint-enable camelcase */

    if (accessMode === 'online') {
      redirectParams['grant_options[]'] = 'per-user';
    }

    const formattedQueryString = querystring.stringify(redirectParams);
    const redirectTo = `https://${shop}/admin/oauth/authorize?${formattedQueryString}`;

    ctx.body = `
      <!DOCTYPE html>
      <html>
        <head>
          <script type="text/javascript">
            window.top.location.href = "${redirectTo}"
          </script>
        </head>
      </html>`;

    next();
  };
}
