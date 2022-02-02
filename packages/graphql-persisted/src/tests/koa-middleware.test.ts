import faker from '@faker-js/faker/locale/en';
import {Header} from '@shopify/network';
import {createMockContext} from '@shopify/jest-koa-mocks';
import {setAssets} from '@shopify/sewing-kit-koa';

import {
  Cache,
  CacheMissBehavior,
  createPersistedGraphQLMiddleware,
} from '../koa-middleware';

describe('persistedGraphQLMiddleware', () => {
  it('only calls next when the request does not look like a persisted GraphQL query', async () => {
    const ctx = createContext({persisted: false});
    const cache = createCache();
    const spy = jest.fn();
    const persistedGraphQLMiddleware = createPersistedGraphQLMiddleware({
      cache,
    });

    await persistedGraphQLMiddleware(ctx, spy);

    expect(spy).toHaveBeenCalled();
    expect(cache.get).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('does not augment the body if there is a persisted query body and an explicit GraphQL query', async () => {
    const ctx = createContext({
      persisted: true,
      query: createQuery(),
    });
    const cache = createCache();
    const spy = jest.fn();
    const persistedGraphQLMiddleware = createPersistedGraphQLMiddleware({
      cache,
    });

    await persistedGraphQLMiddleware(ctx, spy);

    expect(spy).toHaveBeenCalled();
    expect(cache.get).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('caches the query if there is a persisted query body and explicit GraphQL query when SendAndStore is set', async () => {
    const id = faker.datatype.uuid();
    const query = createQuery();
    const ctx = createContext({id, query, persisted: true});
    const cache = createCache();
    const spy = jest.fn();
    const persistedGraphQLMiddleware = createPersistedGraphQLMiddleware({
      cache,
      cacheMissBehavior: CacheMissBehavior.SendAndStore,
    });

    await persistedGraphQLMiddleware(ctx, spy);

    expect(spy).toHaveBeenCalled();
    expect(cache.get).not.toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalledWith(id, query);
  });

  it('sets the body.query to a query returned by sewing-kit-koa', async () => {
    const id = faker.datatype.uuid();
    const query = createQuery();
    const ctx = createContext({id, persisted: true});
    setAssets(ctx, {graphQLSource: () => Promise.resolve(query)});

    const spy = jest.fn();
    const persistedGraphQLMiddleware = createPersistedGraphQLMiddleware();

    await persistedGraphQLMiddleware(ctx, spy);

    expect(spy).toHaveBeenCalled();
    expect(ctx.request).toHaveProperty('body.query', query);
  });

  it('saves the query returned by sewing-kit-koa to the cache when provided', async () => {
    const id = faker.datatype.uuid();
    const query = createQuery();
    const ctx = createContext({id, persisted: true});
    setAssets(ctx, {graphQLSource: () => Promise.resolve(query)});

    const cache = createCache();
    const persistedGraphQLMiddleware = createPersistedGraphQLMiddleware({
      cache,
    });

    await persistedGraphQLMiddleware(ctx, noop);

    expect(cache.set).toHaveBeenCalledWith(id, query);
  });

  it('sets the body.query to a query returned by cache.get', async () => {
    const id = faker.datatype.uuid();
    const query = createQuery();
    const ctx = createContext({id, persisted: true});

    const spy = jest.fn();
    const cache = createCache({get: jest.fn(() => Promise.resolve(query))});
    const persistedGraphQLMiddleware = createPersistedGraphQLMiddleware({
      cache,
    });

    await persistedGraphQLMiddleware(ctx, spy);

    expect(spy).toHaveBeenCalled();
    expect(cache.get).toHaveBeenCalledWith(id);
    expect(ctx.request).toHaveProperty('body.query', query);
  });

  it('sets the context to be JSON and returns a single error with the cacheMissBehavior', async () => {
    const ctx = createContext({persisted: true});

    const spy = jest.fn();
    const cache = createCache({get: () => Promise.resolve(undefined)});
    const cacheMissBehavior = CacheMissBehavior.Error;
    const persistedGraphQLMiddleware = createPersistedGraphQLMiddleware({
      cache,
      cacheMissBehavior,
    });

    await persistedGraphQLMiddleware(ctx, spy);

    expect(spy).not.toHaveBeenCalled();
    expect(ctx.get(Header.ContentType)).toBe('application/json');
    expect(ctx).toHaveProperty('body', {
      errors: [{message: cacheMissBehavior}],
    });
  });
});

function createQuery() {
  return 'query Test{shop{name}}';
}

function createBody({
  query,
  persisted = true,
  id = faker.datatype.uuid(),
}: {query?: string; persisted?: boolean; id?: string} = {}) {
  const extensions = persisted ? {persisted: {id}} : {};

  return {
    query,
    operationName: 'Test',
    extensions,
    variables: {},
  };
}

function createContext({
  query,
  id,
  persisted = true,
  body = createBody({id, persisted, query}),
}: {persisted?: boolean; query?: string; id?: string; body?: object} = {}) {
  return createMockContext({
    requestBody: body,
    headers: {[Header.ContentType]: 'application/json'},
  });
}

function createCache({
  get = jest.fn(),
  set = jest.fn(),
}: Partial<Cache> = {}): Cache {
  return {get, set};
}

function noop() {}
