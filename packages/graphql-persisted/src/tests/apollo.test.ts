import faker from '@faker-js/faker/locale/en';
import {ApolloLink, gql} from '@apollo/client';

import {createPersistedLink} from '../apollo';
import {CacheMissBehavior} from '../shared';

import {executeOnce, SimpleLink} from './utilities';

describe('PersistedLink', () => {
  it('includes the persisted ID extension when an ID is provided', async () => {
    const id = faker.datatype.uuid();

    const {operation} = await executeOnce(
      ApolloLink.from([createPersistedLink(), new SimpleLink()]),
      createQuery(id),
    );

    expect(operation.extensions).toHaveProperty('persisted.id', id);
    expect(operation.getContext()).toMatchObject({
      http: {includeQuery: false, includeExtensions: true},
    });
  });

  it('includes the persisted ID extension when idFromOperation returns an ID', async () => {
    const id = faker.datatype.uuid();

    const {operation} = await executeOnce(
      ApolloLink.from([
        createPersistedLink({
          idFromOperation: () => id,
        }),
        new SimpleLink(),
      ]),
      createQuery(),
    );

    expect(operation.extensions).toHaveProperty('persisted.id', id);
    expect(operation.getContext()).toMatchObject({
      http: {includeQuery: false, includeExtensions: true},
    });
  });

  it('does not include the persisted ID extension when no ID is present', async () => {
    const {operation} = await executeOnce(
      ApolloLink.from([createPersistedLink(), new SimpleLink()]),
      createQuery(),
    );

    expect(operation.extensions).not.toHaveProperty('persisted.id');
    expect(operation.getContext()).not.toMatchObject({
      http: {includeQuery: false, includeExtensions: true},
    });
  });

  it('forwards the results of subsequent links', async () => {
    const id = faker.datatype.uuid();
    const expected = {data: {shop: {name: 'Snowdevil'}}};

    const {result} = await executeOnce(
      ApolloLink.from([createPersistedLink(), new SimpleLink(expected)]),
      createQuery(id),
    );

    expect(result).toBe(expected);
  });

  describe('CacheMissBehavior.Error', () => {
    it('resolves to the error', async () => {
      const id = faker.datatype.uuid();
      const error = {errors: [{message: CacheMissBehavior.SendAndStore}]};

      const {result} = await executeOnce(
        ApolloLink.from([createPersistedLink(), new SimpleLink(error)]),
        createQuery(id),
      );

      expect(result).toBe(error);
    });

    it('still tries to send persisted queries on subsequent calls with the same ID', async () => {
      const id = faker.datatype.uuid();
      const error = {errors: [{message: CacheMissBehavior.Error}]};
      const data = {data: {shop: {name: 'Snowdevil'}}};
      const persistedLink = createPersistedLink();

      await executeOnce(
        ApolloLink.from([persistedLink, new SimpleLink(error)]),
        createQuery(id),
      );

      const {operation, result} = await executeOnce(
        ApolloLink.from([persistedLink, new SimpleLink(data)]),
        createQuery(id),
      );

      expect(result).toBe(data);
      expect(operation.extensions).toHaveProperty('persisted.id');
      expect(operation.getContext()).toMatchObject({
        http: {includeQuery: false, includeExtensions: true},
      });
    });
  });

  describe('CacheMissBehavior.SendAndStore', () => {
    it('sends the full query when an error occurs', async () => {
      const id = faker.datatype.uuid();
      const error = {errors: [{message: CacheMissBehavior.SendAndStore}]};
      const data = {data: {shop: {name: 'Snowdevil'}}};

      const {operation, result} = await executeOnce(
        ApolloLink.from([createPersistedLink(), new SimpleLink([error, data])]),
        createQuery(id),
      );

      expect(result).toBe(data);
      expect(operation.extensions).toHaveProperty('persisted.id');
      expect(operation.getContext()).toMatchObject({
        http: {includeQuery: true, includeExtensions: true},
      });
    });

    it('sends only the persisted ID on subsequent calls', async () => {
      const id = faker.datatype.uuid();
      const error = {errors: [{message: CacheMissBehavior.SendAndStore}]};
      const data = {data: {shop: {name: 'Snowdevil'}}};
      const persistedLink = createPersistedLink();

      await executeOnce(
        ApolloLink.from([persistedLink, new SimpleLink([error, data])]),
        createQuery(id),
      );

      const {operation, result} = await executeOnce(
        ApolloLink.from([persistedLink, new SimpleLink(data)]),
        createQuery(id),
      );

      expect(result).toBe(data);
      expect(operation.extensions).toHaveProperty('persisted.id');
      expect(operation.getContext()).toMatchObject({
        http: {includeQuery: false, includeExtensions: true},
      });
    });
  });

  describe('CacheMissBehavior.SendAlways', () => {
    it('sends the full query when an error occurs', async () => {
      const id = faker.datatype.uuid();
      const error = {errors: [{message: CacheMissBehavior.SendAlways}]};
      const data = {data: {shop: {name: 'Snowdevil'}}};

      const {operation, result} = await executeOnce(
        ApolloLink.from([createPersistedLink(), new SimpleLink([error, data])]),
        createQuery(id),
      );

      expect(result).toBe(data);
      expect(operation.extensions).not.toHaveProperty('persisted.id');
      expect(operation.getContext()).toMatchObject({
        http: {includeQuery: true, includeExtensions: false},
      });
    });

    it('sends the full query on subsequent calls with the same ID', async () => {
      const id = faker.datatype.uuid();
      const error = {errors: [{message: CacheMissBehavior.SendAlways}]};
      const data = {data: {shop: {name: 'Snowdevil'}}};
      const persistedLink = createPersistedLink();

      await executeOnce(
        ApolloLink.from([persistedLink, new SimpleLink([error, data])]),
        createQuery(id),
      );

      const {operation, result} = await executeOnce(
        ApolloLink.from([persistedLink, new SimpleLink(data)]),
        createQuery(id),
      );

      expect(result).toBe(data);
      expect(operation.extensions).not.toHaveProperty('persisted.id');
      expect(operation.getContext()).not.toMatchObject({
        http: {includeQuery: false, includeExtensions: true},
      });
    });
  });
});

function createQuery(id?: string) {
  const testQuery = gql`
    query Test {
      shop {
        name
      }
    }
  `;

  testQuery.id = id;

  return testQuery;
}
