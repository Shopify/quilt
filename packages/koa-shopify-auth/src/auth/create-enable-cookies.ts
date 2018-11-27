import {Context} from 'koa';

import Error from './errors';
import itpTemplate, {readTemplate} from './itp-template';

const script = readTemplate('enable-cookies.js');

export default function createEnableCookies() {
  return function enableCookies(ctx: Context) {
    const {query} = ctx;
    const {shop} = query;

    if (shop == null) {
      ctx.throw(400, Error.ShopParamMissing);
      return;
    }

    ctx.body = itpTemplate(ctx, {
      heading: 'Enable cookies',
      body:
        'You must manually enable cookies in this browser in order to use this app within Shopify.',
      footer: `Cookies let the app authenticate you by temporarily storing your preferences and personal information. They expire after 30 days.`,
      action: 'Enable cookies',
      script,
      shop,
    });
  };
}
