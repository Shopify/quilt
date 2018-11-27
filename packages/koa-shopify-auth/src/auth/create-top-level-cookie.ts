import {Context} from 'koa';

import Error from './errors';
import itpTemplate, {readTemplate} from './itp-template';

const script = readTemplate('top-level.js');

export default function createTopLevelCookie() {
  return function topLevelCookie(ctx: Context) {
    const {query} = ctx;
    const {shop} = query;

    if (shop == null) {
      ctx.throw(400, Error.ShopParamMissing);
      return;
    }

    ctx.body = itpTemplate(ctx, {
      heading: `Your browser needs to authenticate ${ctx.state.appName}`,
      body: `Your browser requires third-party apps like ${
        ctx.state.appName
      } to ask you for access to cookies before Shopify can open it for you.`,
      action: 'Continue',
      script,
      shop,
    });
  };
}
