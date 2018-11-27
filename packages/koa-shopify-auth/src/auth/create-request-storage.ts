import {Context} from 'koa';

import Error from './errors';
import itpTemplate, {readTemplate} from './itp-template';

const script = readTemplate('request-storage.js');

export default function createRequestStorage() {
  return function requestStorage(ctx: Context) {
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
