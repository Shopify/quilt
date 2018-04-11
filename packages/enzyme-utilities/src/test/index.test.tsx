import * as React from 'react';
import {mount} from 'enzyme';
import {trigger} from '..';
import {Toggle} from './Toggle';
import {ActionList, Action} from './Actions';

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
});
