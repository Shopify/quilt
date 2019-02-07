import * as React from 'react';
import {mount} from 'enzyme';
import gql from 'graphql-tag';

import {trigger} from '@shopify/enzyme-utilities';
import {Async} from '@shopify/react-async';

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

    const AsyncComponent = createAsyncQueryComponent({load, id});
    const asyncComponent = mount(<AsyncComponent {...defaultProps} />);
    expect(asyncComponent.find(Async).props()).toMatchObject({load, id});
  });

  it('renders a Query component when the query is available, and null otherwise', () => {
    const load = () => Promise.resolve(query);
    const props = {
      ...defaultProps,
      fetchPolicy: 'cache-first' as 'cache-first',
    };
    const AsyncComponent = createAsyncQueryComponent({load});
    const asyncComponent = mount(<AsyncComponent {...props} />);

    expect(trigger(asyncComponent.find(Async), 'render', null)).toBeNull();
    expect(trigger(asyncComponent.find(Async), 'render', query)).toEqual(
      <Query query={query} {...props} />,
    );
  });

  describe('<Preload />', () => {
    it('renders a deferred loader', () => {
      const load = () => Promise.resolve(query);
      const AsyncComponent = createAsyncQueryComponent({load});
      const preload = mount(<AsyncComponent.Preload />);
      expect(preload).toContainReact(<Async defer load={load} />);
    });
  });

  describe('<Prefetch />', () => {
    it('renders an <Async /> that then renders a prefetch query', () => {
      const load = () => Promise.resolve(query);
      const AsyncComponent = createAsyncQueryComponent({load});
      const prefetch = mount(<AsyncComponent.Prefetch />);

      expect(prefetch.find(Async).props()).toMatchObject({load, defer: true});
      expect(trigger(prefetch.find(Async), 'render', null)).toBeNull();
      expect(trigger(prefetch.find(Async), 'render', query)).toEqual(
        <Prefetch ignoreCache query={query} />,
      );
    });
  });

  describe('<KeepFresh />', () => {
    it('renders an <Async /> that then renders a prefetch query with a poll interval', () => {
      const load = () => Promise.resolve(query);
      const AsyncComponent = createAsyncQueryComponent({load});
      const keepFresh = mount(<AsyncComponent.KeepFresh />);

      expect(keepFresh.find(Async).props()).toMatchObject({load, defer: true});
      expect(trigger(keepFresh.find(Async), 'render', null)).toBeNull();
      expect(trigger(keepFresh.find(Async), 'render', query)).toEqual(
        <Prefetch query={query} pollInterval={expect.any(Number)} />,
      );
    });

    it('uses a custom poll interval', () => {
      const load = () => Promise.resolve(query);
      const pollInterval = 12_345;
      const AsyncComponent = createAsyncQueryComponent({load});
      const keepFresh = mount(
        <AsyncComponent.KeepFresh pollInterval={pollInterval} />,
      );

      expect(trigger(keepFresh.find(Async), 'render', query)).toEqual(
        <Prefetch query={query} pollInterval={pollInterval} />,
      );
    });
  });
});
