import * as React from 'react';
import {mount} from 'enzyme';

import {trigger, findById} from '..';

import {Toggle} from './fixtures/Toggle';
import {ActionList, Action} from './fixtures/Actions';

describe('enzyme-utilities', () => {
  describe('trigger', () => {
    it('calls functions on props with arguments', () => {
      const spy = jest.fn();
      const actionList = mount(
        <ActionList
          handlers={[
            {
              name: 'spy',
              onAction: spy,
            },
          ]}
        />,
      );

      trigger(actionList, 'handlers.0.onAction', 'hello', 1, 2, 3);
      expect(spy).toHaveBeenCalledWith('hello', 1, 2, 3);
    });

    it('updates root after asynchronous functions resolve', async () => {
      const spy = jest.fn();
      const toggle = mount(<Toggle onToggle={spy} deferred />);

      const promise = trigger(toggle.find('button'), 'onClick');
      expect(toggle.find('button').text()).toBe('active');

      await promise;
      expect(toggle.find('button').text()).toBe('inactive');
    });
  });

  describe('findById', () => {
    it('finds an element with a matching ID', () => {
      const matchedNode = <div id="foo" />;
      const found = findById(
        mount(
          <div>
            {matchedNode}
            <div id="bar" />
          </div>,
        ),
        'foo',
      );

      expect(found.getElement()).toEqual(matchedNode);
    });

    it('only returns an outer component when it renders its own children with the same ID', () => {
      function MyComponent({id}: {id: string}) {
        return <div id={id} />;
      }

      const found = findById(mount(<MyComponent id="foo" />), 'foo');
      expect(found).toHaveLength(1);
      expect(found.first().is(MyComponent)).toBe(true);
    });
  });
});
