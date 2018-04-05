import {Context} from 'koa';
import querystring from 'querystring';

import {Options} from './types';

export default function createOAuthStart({
  scopes,
  apiKey,
  prefix,
  accessMode,
}: Options) {
  return function oAuthStart(ctx: Context) {
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
            document.addEventListener('DOMContentLoaded', function() {
              if (window.top === window.self) {
                // If the current window is the 'parent', change the URL by setting location.href
                window.location.href = '${redirectTo}';
              } else {
                // If the current window is the 'child', change the parent's URL with postMessage
                data = JSON.stringify({
                  message: 'Shopify.API.remoteRedirect',
                  data: { location: '${redirectTo}' }
                });

                window.parent.postMessage(data, targetInfo.myshopifyUrl);
              }
            });
          </script>
        </head>
      </html>`;
  };
}
