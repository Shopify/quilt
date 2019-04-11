import * as React from 'react';
import {mount} from 'enzyme';
import {trigger} from '@shopify/enzyme-utilities';
import {DeferTiming} from '@shopify/async';

import {Async} from '../Async';
import {createAsyncContext} from '../provider';

jest.mock('../Async', () => ({
  Async() {
    return null;
  },
}));

const mockValue = Object.freeze({
  hello: 'world',
});

describe('createAsyncContext()', () => {
  describe('<Provider />', () => {
    it('renders an <Async /> with the provided props', () => {
      const load = () => Promise.resolve(mockValue);
      const id = () => 'foo';

      const AsyncContext = createAsyncContext({load, id});
      const asyncContext = mount(<AsyncContext.Provider />);
      expect(asyncContext.find(Async).props()).toMatchObject({
        load,
        id,
      });
    });

    it('renders the context provider with its intended value when available, and returns null otherwise', () => {
      const load = () => Promise.resolve(mockValue);
      const AsyncContext = createAsyncContext({load});
      const asyncContext = mount(<AsyncContext.Provider />);

      expect(trigger(asyncContext.find(Async), 'render', null)).toStrictEqual(
        <AsyncContext.Context.Provider value={null} />,
      );

      expect(
        trigger(asyncContext.find(Async), 'render', mockValue),
      ).toStrictEqual(<AsyncContext.Context.Provider value={mockValue} />);
    });
  });

  describe('<Preload />', () => {
    it('renders a deferred <Async />', () => {
      const load = () => Promise.resolve(mockValue);
      const AsyncContext = createAsyncContext({load});
      const preload = mount(<AsyncContext.Preload />);
      expect(preload).toContainReact(
        <Async defer={DeferTiming.Idle} load={load} />,
      );
    });
  });
});
