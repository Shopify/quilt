import * as React from 'react';
import gql from 'graphql-tag';
import ApolloClient, {NetworkStatus} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createMount} from '@shopify/react-testing';

import {DeferTiming} from '@shopify/async';
import {Async} from '@shopify/react-async';

import {Query} from '../Query';
import {Prefetch} from '../Prefetch';
import {ApolloProvider} from '../ApolloProvider';
import {createAsyncQueryComponent} from '../async';

jest.mock('../Query', () => ({
  Query() {
    return null;
  },
}));

jest.mock('../Prefetch', () => ({
  Prefetch() {
    return null;
  },
}));

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

const defaultProps = {
  children: () => null,
};

describe('createAsyncQueryComponent()', () => {
  it('creates a component that mounts an <Async />', () => {
    const load = () => Promise.resolve(query);
    const id = () => 'foo';

    const AsyncQueryComponent = createAsyncQueryComponent({load, id});
    const asyncQueryComponent = mount(
      <AsyncQueryComponent {...defaultProps} />,
    );
    expect(asyncQueryComponent).toContainReactComponent(Async, {load, id});
  });

  it('renders the children with a noop loading result while the query is loading', () => {
    const children = <div>Hello world</div>;
    const spy = jest.fn(() => children);
    const client = createMockApolloClient();
    const variables = {foo: 'bar'};
    const props = {
      ...defaultProps,
      children: spy,
      variables,
    };

    const AsyncQueryComponent = createAsyncQueryComponent<
      {},
      {foo: string},
      {}
    >({
      load: () => Promise.resolve(query),
    });
    const asyncQueryComponent = mount(<AsyncQueryComponent {...props} />, {
      client,
    });

    expect(
      asyncQueryComponent.find(Async)!.trigger('render', null),
    ).toMatchObject(children);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        client,
        loading: true,
        data: undefined,
        variables,
        networkStatus: NetworkStatus.loading,
      }),
    );
  });

  it('renders a Query component when the query is available, and null otherwise', () => {
    const load = () => Promise.resolve(query);
    const props = {
      ...defaultProps,
      fetchPolicy: 'cache-first' as 'cache-first',
    };
    const AsyncQueryComponent = createAsyncQueryComponent({load});
    const asyncQueryComponent = mount(<AsyncQueryComponent {...props} />);

    expect(
      asyncQueryComponent.find(Async)!.trigger('render', query),
    ).toMatchObject(<Query query={query} {...props} />);
  });

  it('creates a deferred <Async /> when specified', () => {
    const defer = DeferTiming.Idle;
    const AsyncQueryComponent = createAsyncQueryComponent({
      load: () => Promise.resolve(query),
      defer,
    });
    const asyncQueryComponent = mount(
      <AsyncQueryComponent {...defaultProps} />,
    );
    expect(asyncQueryComponent).toContainReactComponent(Async, {defer});
  });

  it('allows passing custom async props', () => {
    const load = () => Promise.resolve(query);
    const asyncProps = {defer: undefined};

    const AsyncQueryComponent = createAsyncQueryComponent({load});
    const asyncQueryComponent = mount(
      <AsyncQueryComponent {...defaultProps} async={asyncProps} />,
    );
    expect(asyncQueryComponent).toContainReactComponent(Async, asyncProps);
  });

  describe('<Preload />', () => {
    it('renders a deferred (to idle) loader', () => {
      const load = () => Promise.resolve(query);
      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const preload = mount(<AsyncQueryComponent.Preload />);
      expect(preload).toContainReactComponent(Async, {
        defer: DeferTiming.Idle,
        load,
      });
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(query);
      const asyncProps = {defer: undefined};

      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const preload = mount(<AsyncQueryComponent.Preload async={asyncProps} />);
      expect(preload).toContainReactComponent(Async, asyncProps);
    });
  });

  describe('<Prefetch />', () => {
    it('renders a deferred (to mount) <Async /> that then renders a prefetch query', () => {
      const load = () => Promise.resolve(query);
      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const prefetch = mount(<AsyncQueryComponent.Prefetch />);

      expect(prefetch).toContainReactComponent(Async, {
        load,
        defer: DeferTiming.Mount,
      });
      expect(prefetch.find(Async)!.trigger('render', null)).toBeNull();
      expect(prefetch.find(Async)!.trigger('render', query)).toMatchObject(
        <Prefetch ignoreCache query={query} />,
      );
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(query);
      const asyncProps = {defer: undefined};

      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const prefetch = mount(
        <AsyncQueryComponent.Prefetch async={asyncProps} />,
      );
      expect(prefetch).toContainReactComponent(Async, asyncProps);
    });
  });

  describe('<KeepFresh />', () => {
    it('renders an <Async /> that then renders a prefetch query with a poll interval', () => {
      const load = () => Promise.resolve(query);
      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const keepFresh = mount(<AsyncQueryComponent.KeepFresh />);

      expect(keepFresh).toContainReactComponent(Async, {
        load,
        defer: DeferTiming.Idle,
      });
      expect(keepFresh.find(Async)!.trigger('render', null)).toBeNull();
      expect(keepFresh.find(Async)!.trigger('render', query)).toMatchObject(
        <Prefetch query={query} pollInterval={expect.any(Number)} />,
      );
    });

    it('uses a custom poll interval', () => {
      const load = () => Promise.resolve(query);
      const pollInterval = 12_345;
      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const keepFresh = mount(
        <AsyncQueryComponent.KeepFresh pollInterval={pollInterval} />,
      );

      expect(keepFresh.find(Async)!.trigger('render', query)).toMatchObject(
        <Prefetch query={query} pollInterval={pollInterval} />,
      );
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(query);
      const asyncProps = {defer: undefined};

      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const keepFresh = mount(
        <AsyncQueryComponent.KeepFresh async={asyncProps} />,
      );
      expect(keepFresh).toContainReactComponent(Async, asyncProps);
    });
  });
});

function createMockApolloClient() {
  return new ApolloClient({
    link: ApolloLink.empty(),
    cache: new InMemoryCache(),
  });
}
