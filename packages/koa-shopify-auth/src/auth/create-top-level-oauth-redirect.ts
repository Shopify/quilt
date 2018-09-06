import {Context} from 'koa';

import createTopLevelRedirect from './create-top-level-redirect';
import {TOP_LEVEL_OAUTH_COOKIE_NAME} from './index';

export default function createTopLevelOAuthRedirect(path: string) {
  const redirect = createTopLevelRedirect(path);

  return function topLevelOAuthRedirect(ctx: Context) {
    ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME, '1');
    redirect(ctx);
  };
}
