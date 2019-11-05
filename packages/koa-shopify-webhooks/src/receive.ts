import {createHmac} from 'crypto';

import safeCompare from 'safe-compare';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
import compose from 'koa-compose';
import {Context, Middleware} from 'koa';
import {StatusCode} from '@shopify/network';

import {WebhookHeader, Topic} from './types';

interface Options {
  secret: string;
  path?: string;
  onReceived?(ctx: Context);
}

export interface WebhookState {
  topic: Topic;
  domain: string;
}

interface ParsedContext extends Context {
  request: Context['request'] & {rawBody: string};
}

export function receiveWebhook({
  secret,
  path,
  onReceived = noop,
}: Options): Middleware {
  async function receiveWebhookMiddleware(ctx: Context, next: () => unknown) {
    const hmac = ctx.get(WebhookHeader.Hmac);
    const topic = ctx.get(WebhookHeader.Topic);
    const domain = ctx.get(WebhookHeader.Domain);
    const {rawBody} = (ctx as ParsedContext).request;

    const generatedHash = createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    const graphqlTopic = topic.toUpperCase().replace(/\//g, '_');

    if (safeCompare(generatedHash, hmac)) {
      ctx.res.statusCode = StatusCode.Accepted;

      ctx.state.webhook = {
        topic: graphqlTopic as Topic,
        domain,
      };

      await onReceived(ctx);
      await next();
    } else {
      ctx.res.statusCode = StatusCode.Forbidden;
    }
  }

  const middleware = compose([bodyParser(), receiveWebhookMiddleware]);

  return path ? mount(path, middleware) : middleware;
}

function noop() {}
