import {Context} from 'koa';

import Error from './errors';
import itpTemplate from './itp-template';

export default function createTopLevelCookie(script: string) {
  return function enableCookies(ctx: Context) {
    const {query} = ctx;
    const {shop} = query;

    if (shop == null) {
      ctx.throw(400, Error.ShopParamMissing);
      return;
    }

    ctx.body = itpTemplate(ctx, {
      heading: 'Your browser needs to authenticate <TODO appname>',
      body:
        'Your browser requires third-party apps like %{app} to ask you for access to cookies before Shopify can open it for you.',
      action: 'Continue',
      script,
      shop,
    });
  };
}
