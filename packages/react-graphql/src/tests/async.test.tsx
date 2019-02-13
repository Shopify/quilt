import * as React from 'react';
import {mount} from 'enzyme';
import gql from 'graphql-tag';

import {trigger} from '@shopify/enzyme-utilities';
import {Async, DeferTiming} from '@shopify/react-async';

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
    expect(asyncQueryComponent.find(Async).props()).toMatchObject({load, id});
  });

  it('renders a Query component when the query is available, and null otherwise', () => {
    const load = () => Promise.resolve(query);
    const props = {
      ...defaultProps,
      fetchPolicy: 'cache-first' as 'cache-first',
    };
    const AsyncQueryComponent = createAsyncQueryComponent({load});
    const asyncQueryComponent = mount(<AsyncQueryComponent {...props} />);

    expect(trigger(asyncQueryComponent.find(Async), 'render', null)).toBeNull();
    expect(trigger(asyncQueryComponent.find(Async), 'render', query)).toEqual(
      <Query query={query} {...props} />,
    );
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
    expect(asyncQueryComponent.find(Async)).toHaveProp('defer', defer);
  });

  it('allows passing custom async props', () => {
    const load = () => Promise.resolve(query);
    const async = {defer: undefined};

    const AsyncQueryComponent = createAsyncQueryComponent({load});
    const asyncQueryComponent = mount(
      <AsyncQueryComponent {...defaultProps} async={async} />,
    );
    expect(asyncQueryComponent.find(Async).props()).toMatchObject(async);
  });

  describe('<Preload />', () => {
    it('renders a deferred (to idle) loader', () => {
      const load = () => Promise.resolve(query);
      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const preload = mount(<AsyncQueryComponent.Preload />);
      expect(preload).toContainReact(
        <Async defer={DeferTiming.Idle} load={load} />,
      );
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(query);
      const async = {defer: undefined};

      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const preload = mount(<AsyncQueryComponent.Preload async={async} />);
      expect(preload.find(Async).props()).toMatchObject(async);
    });
  });

  describe('<Prefetch />', () => {
    it('renders a deferred (to mount) <Async /> that then renders a prefetch query', () => {
      const load = () => Promise.resolve(query);
      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const prefetch = mount(<AsyncQueryComponent.Prefetch />);

      expect(prefetch.find(Async).props()).toMatchObject({
        load,
        defer: DeferTiming.Mount,
      });
      expect(trigger(prefetch.find(Async), 'render', null)).toBeNull();
      expect(trigger(prefetch.find(Async), 'render', query)).toEqual(
        <Prefetch ignoreCache query={query} />,
      );
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(query);
      const async = {defer: undefined};

      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const prefetch = mount(<AsyncQueryComponent.Prefetch async={async} />);
      expect(prefetch.find(Async).props()).toMatchObject(async);
    });
  });

  describe('<KeepFresh />', () => {
    it('renders an <Async /> that then renders a prefetch query with a poll interval', () => {
      const load = () => Promise.resolve(query);
      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const keepFresh = mount(<AsyncQueryComponent.KeepFresh />);

      expect(keepFresh.find(Async).props()).toMatchObject({
        load,
        defer: DeferTiming.Idle,
      });
      expect(trigger(keepFresh.find(Async), 'render', null)).toBeNull();
      expect(trigger(keepFresh.find(Async), 'render', query)).toEqual(
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

      expect(trigger(keepFresh.find(Async), 'render', query)).toEqual(
        <Prefetch query={query} pollInterval={pollInterval} />,
      );
    });

    it('allows passing custom async props', () => {
      const load = () => Promise.resolve(query);
      const async = {defer: undefined};

      const AsyncQueryComponent = createAsyncQueryComponent({load});
      const keepFresh = mount(<AsyncQueryComponent.KeepFresh async={async} />);
      expect(keepFresh.find(Async).props()).toMatchObject(async);
    });
  });
});
