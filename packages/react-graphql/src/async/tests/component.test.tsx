import React, {ReactElement} from 'react';
import faker from '@faker-js/faker/locale/en';
import {ApolloClient, ApolloLink, InMemoryCache, gql} from '@apollo/client';
import {getUsedAssets as baseGetUsedAssets} from '@shopify/react-async/testing';
import {createMount} from '@shopify/react-testing';
import {
  requestIdleCallback,
  intersectionObserver,
} from '@shopify/jest-dom-mocks';
import {AssetTiming} from '@shopify/react-async';

import {ApolloProvider} from '../../ApolloProvider';
import {createAsyncQueryComponent} from '../component';

const query = gql`
  query MyQuery {
    shop {
      id
    }
  }
`;

const mount = createMount<{client?: ApolloClient<any>}, {}, false>({
  render(element, _, {client = createMockApolloClient()}) {
    return <ApolloProvider client={client}>{element}</ApolloProvider>;
  },
});

function getUsedAssets(element: ReactElement, timing?: AssetTiming) {
  return baseGetUsedAssets(
    <ApolloProvider client={createMockApolloClient()}>
      {element}
    </ApolloProvider>,
    timing,
  );
}

const defaultProps = {
  children: () => null,
};

function Children() {
  return null;
}

describe('createAsyncQueryComponent()', () => {
  beforeEach(() => {
    requestIdleCallback.mock();
    intersectionObserver.mock();
  });

  afterEach(() => {
    requestIdleCallback.cancelIdleCallbacks();
    requestIdleCallback.restore();
    intersectionObserver.restore();
  });

  it('renders the children with a noop loading result while the query is loading', () => {
    const spy = jest.fn(() => <Children />);
    const client = createMockApolloClient();
    const resolvable = createResolvablePromise(query);

    const variables = {foo: 'bar'};
    const props = {
      ...defaultProps,
      children: spy,
      variables,
    };

    const AsyncQuery = createAsyncQueryComponent<{}, {foo: string}, {}>({
      load: () => resolvable.promise,
    });

    const asyncQuery = mount(<AsyncQuery {...props} />, {
      client,
    });

    expect(asyncQuery).toContainReactComponent(Children);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        client,
        loading: true,
        data: undefined,
        variables,
      }),
    );
  });

  describe('<Preload />', () => {
    it('loads the query asset in an idle callback', () => {
      const load = jest.fn(() => resolvable.promise);
      const resolvable = createResolvablePromise(query);
      const AsyncQuery = createAsyncQueryComponent({load});

      const asyncQuery = mount(<AsyncQuery.Preload />);

      expect(load).not.toHaveBeenCalled();

      asyncQuery.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).toHaveBeenCalled();
    });

    it('marks the assets as being used on the next page', async () => {
      const id = faker.datatype.uuid();
      const AsyncQuery = createAsyncQueryComponent({
        id: () => id,
        load: () => createResolvablePromise(query).promise,
      });

      expect(
        await getUsedAssets(<AsyncQuery.Preload />, AssetTiming.NextPage),
      ).toContainEqual({id, scripts: true, styles: true});
    });
  });

  describe('<Prefetch />', () => {
    it('loads the component assets on mount', () => {
      const load = jest.fn(() => resolvable.promise);
      const resolvable = createResolvablePromise(query);
      const AsyncQuery = createAsyncQueryComponent({load});

      const asyncQuery = mount(<AsyncQuery.Prefetch />);

      expect(load).not.toHaveBeenCalled();

      asyncQuery.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).toHaveBeenCalled();
    });

    it('performs the query once it has been loaded, and forces it to run against the network', async () => {
      const resolvable = createResolvablePromise(query);
      const AsyncQuery = createAsyncQueryComponent<{}, {name: string}, {}>({
        load: () => resolvable.promise,
      });

      const client = createMockApolloClient();
      const watchQuerySpy = jest.spyOn(client, 'watchQuery');
      watchQuerySpy.mockImplementation(() => ({subscribe() {}} as any));

      const variables = {name: faker.name.firstName()};
      const asyncQuery = mount(<AsyncQuery.Prefetch variables={variables} />, {
        client,
      });

      await asyncQuery.act(async () => {
        requestIdleCallback.runIdleCallbacks();
        await resolvable.resolve();
      });

      expect(watchQuerySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          query,
          variables,
          fetchPolicy: 'network-only',
        }),
      );
    });

    it('marks the assets as being used on the next page', async () => {
      const id = faker.datatype.uuid();
      const AsyncQuery = createAsyncQueryComponent({
        id: () => id,
        load: () => createResolvablePromise(query).promise,
      });

      expect(
        await getUsedAssets(<AsyncQuery.Prefetch />, AssetTiming.NextPage),
      ).toContainEqual({id, scripts: true, styles: true});
    });
  });

  describe('<KeepFresh />', () => {
    it('loads the component assets in an idle callback', () => {
      const load = jest.fn(() => resolvable.promise);
      const resolvable = createResolvablePromise(query);
      const AsyncQuery = createAsyncQueryComponent({load});

      const asyncQuery = mount(<AsyncQuery.Preload />);

      expect(load).not.toHaveBeenCalled();

      asyncQuery.act(() => {
        requestIdleCallback.runIdleCallbacks();
      });

      expect(load).toHaveBeenCalled();
    });

    it('performs a polling query once it has been loaded, and forces it to run against the network', async () => {
      const resolvable = createResolvablePromise(query);
      const AsyncQuery = createAsyncQueryComponent<{}, {name: string}, {}>({
        load: () => resolvable.promise,
      });

      const client = createMockApolloClient();
      const watchQuerySpy = jest.spyOn(client, 'watchQuery');
      watchQuerySpy.mockImplementation(() => ({subscribe() {}} as any));

      const variables = {name: faker.name.firstName()};
      const asyncQuery = mount(<AsyncQuery.KeepFresh variables={variables} />, {
        client,
      });

      await asyncQuery.act(async () => {
        requestIdleCallback.runIdleCallbacks();
        await resolvable.resolve();
      });

      expect(watchQuerySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          query,
          variables,
          pollInterval: expect.any(Number),
          fetchPolicy: 'network-only',
        }),
      );
    });

    it('marks the assets as being used on the next page', async () => {
      const id = faker.datatype.uuid();
      const AsyncQuery = createAsyncQueryComponent({
        id: () => id,
        load: () => createResolvablePromise(query).promise,
      });

      expect(
        await getUsedAssets(<AsyncQuery.KeepFresh />, AssetTiming.NextPage),
      ).toContainEqual({id, scripts: true, styles: true});
    });
  });
});

function createMockApolloClient() {
  return new ApolloClient({
    link: ApolloLink.empty(),
    cache: new InMemoryCache(),
  });
}

function createResolvablePromise<T>(value: T) {
  let promiseResolve!: (value: T) => void;
  let resolved = false;

  const promise = new Promise<T>((resolve) => {
    promiseResolve = resolve;
  });

  return {
    promise,
    resolve: () => {
      promiseResolve(value);
      resolved = true;
      return promise;
    },
    resolved: () => resolved,
  };
}
