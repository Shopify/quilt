import {Context} from 'koa';
import compose from 'koa-compose';
import bodyparser from 'koa-bodyparser';
import {getAssets} from '@shopify/sewing-kit-koa';

import {CacheMissBehavior} from './shared';

export {CacheMissBehavior};

export interface Cache {
  get(
    id: string,
  ): string | undefined | null | Promise<string | undefined | null>;
  set(id: string, body: string): Promise<void>;
}

export interface Options {
  cache?: Cache;
  cacheMissBehavior?: CacheMissBehavior;
}

interface PersistedBody {
  query?: string;
  operationName: string;
  variables: {[key: string]: any};
  extensions: {
    persisted: {id: string};
  };
}

function createOperationAssociationMiddleware({
  cache,
  cacheMissBehavior = CacheMissBehavior.SendAlways,
}: Options) {
  if (cacheMissBehavior === CacheMissBehavior.SendAndStore && cache == null) {
    throw new Error(
      'You set the cacheMissBehavior to be SendAndStore, but did not provide a cache, which is necessary to store the persisted operation mapping.',
    );
  }

  return async function persistedOperationAssociationMiddleware(
    ctx: Context,
    next: Function,
  ) {
    const {body} = ctx.request as unknown as {body: unknown};

    if (!isPersistedBody(body)) {
      await next();
      return;
    }

    const {id} = body.extensions.persisted;

    if (body.query != null) {
      if (
        cacheMissBehavior === CacheMissBehavior.SendAndStore &&
        cache != null
      ) {
        await cache.set(id, body.query);
      }

      await next();
      return;
    }

    const assets = getAssets(ctx);

    const operationFromManifest =
      assets != null && assets.graphQLSource != null
        ? await assets.graphQLSource(id)
        : undefined;

    if (typeof operationFromManifest === 'string' && cache != null) {
      cache.set(id, operationFromManifest);
    }

    const operation = operationFromManifest || (cache && (await cache.get(id)));

    if (typeof operation === 'string') {
      body.query = operation;
      await next();
    } else {
      ctx.type = 'json';
      ctx.body = {errors: [{message: cacheMissBehavior}]};
    }
  };
}

export function createPersistedGraphQLMiddleware(options: Options = {}) {
  return compose([bodyparser(), createOperationAssociationMiddleware(options)]);
}

function isPersistedBody(body: unknown): body is PersistedBody {
  if (typeof body !== 'object' || body == null || !('extensions' in body)) {
    return false;
  }

  const extensions = (body as {extensions?: unknown}).extensions;

  if (typeof extensions !== 'object' || extensions == null) {
    return false;
  }

  const {persisted} = extensions as NonNullable<PersistedBody['extensions']>;

  if (typeof persisted !== 'object' || persisted == null) {
    return false;
  }

  return typeof persisted.id === 'string';
}
