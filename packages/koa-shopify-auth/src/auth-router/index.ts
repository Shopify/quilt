import Router from 'koa-router';

import createOAuthStart from './create-oauth-start';
import createOAuthCallback from './create-oauth-callback';
import {Options} from './types';

export default function createShopifyAuthRouter(options: Options) {
  const config = {
    scopes: [],
    accessMode: 'online',
    ...options,
  };

  const router = new Router({
    prefix: config.prefix,
  });

  router.get('/auth', createOAuthStart(config));
  router.get('/auth/callback', createOAuthCallback(config));

  return router;
}
