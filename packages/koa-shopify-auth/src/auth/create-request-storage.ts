import {Context} from 'koa';

import Error from './errors';
import itpTemplate from './itp-template';

export default function createRequestStorage(script: string) {
  return function enableCookies(ctx: Context) {
    const {query} = ctx;
    const {shop} = query;

    if (shop == null) {
      ctx.throw(400, Error.ShopParamMissing);
      return;
    }

    ctx.body = itpTemplate(ctx, {
      heading: '<TODO appname> needs access to cookies',
      body:
        'This lets the app authenticate you by temporarily storing your personal information. Click continue and allow cookies to use the app.',
      footer: 'Cookies expire after 30 days.',
      action: 'Continue',
      script,
      shop,
    });
  };
}
