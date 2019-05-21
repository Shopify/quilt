import * as React from 'react';
import gql from 'graphql-tag';

import {mount} from '@shopify/react-testing';
import {DeferTiming} from '@shopify/async';
import {Async, PreloadPriority} from '@shopify/react-async';

import {Query} from '../Query';
import {Prefetch} from '../Prefetch';
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
    expect(asyncQueryComponent).toContainReactComponent(Async, {
      id,
      load,
      preloadPriority: PreloadPriority.CurrentPage,
    });
  });

  it('renders a Query component when the query is available, and null otherwise', () => {
    const load = () => Promise.resolve(query);
    const props = {
      ...defaultProps,
      fetchPolicy: 'cache-first' as 'cache-first',
    };
    const AsyncQueryComponent = createAsyncQueryComponent({load});
    const asyncQueryComponent = mount(<AsyncQueryComponent {...props} />);

    expect(asyncQueryComponent.find(Async)!.trigger('render', null)).toBeNull();
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
        load,
        defer: DeferTiming.Idle,
        preloadPriority: PreloadPriority.NextPage,
      });
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(query);
      const async = {defer: undefined};

      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const preload = mount(<AsyncQueryComponent.Preload async={async} />);
      expect(preload).toContainReactComponent(Async, async);
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
        preloadPriority: PreloadPriority.NextPage,
      });
      expect(prefetch.find(Async)!.trigger('render', null)).toBeNull();
      expect(prefetch.find(Async)!.trigger('render', query)).toMatchObject(
        <Prefetch ignoreCache query={query} />,
      );
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(query);
      const async = {defer: undefined};

      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const prefetch = mount(<AsyncQueryComponent.Prefetch async={async} />);
      expect(prefetch).toContainReactComponent(Async, async);
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
        preloadPriority: PreloadPriority.NextPage,
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
