import * as React from 'react';
import {mount} from 'enzyme';
import {noop} from '@shopify/javascript-utilities/other';

import {trigger, findById} from '..';

import {Toggle} from './fixtures/Toggle';
import {ActionList, Action} from './fixtures/Actions';

jest.mock('react-dom/test-utils', () => {
  const actualTestUtilities = require.requireActual('react-dom/test-utils');

  return {
    ...actualTestUtilities,
    act: jest.fn(actualTestUtilities.act),
  };
});

const {act} = require.requireMock('react-dom/test-utils') as {act: jest.Mock};

describe('enzyme-utilities', () => {
  beforeEach(() => {
    act.mockClear();
  });

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

    it('calls the callback in an act block', () => {
      const toggle = mount(<Toggle onToggle={() => {}} />);
      trigger(toggle.find('button'), 'onClick');
      expect(act).toHaveBeenCalledTimes(1);
    });

    it('avoids any React warnings for synchronous updates', () => {
      const toggle = mount(<Toggle onToggle={() => {}} />);
      const errors = withConsoleErrors(() =>
        trigger(toggle.find('button'), 'onClick'),
      );
      expect(errors).toHaveLength(0);
    });

    it('updates root after asynchronous functions resolve', async () => {
      const spy = jest.fn();
      const toggle = mount(<Toggle onToggle={spy} deferred />);

      const promise = trigger(toggle.find('button'), 'onClick');
      expect(toggle.find('button').text()).toBe('active');

      await promise;
      expect(toggle.find('button').text()).toBe('inactive');
      expect(spy).toHaveBeenCalled();
    });

    it('throws an error if wrapper has no matching nodes', () => {
      function MyComponent() {
        return <div />;
      }
      const myComponent = mount(<MyComponent />);

      expect(() => trigger(myComponent.find(Toggle), 'onAction')).toThrow(
        'You tried to trigger onAction on a React wrapper with no matching nodes. This generally happens because you have either filtered your React components incorrectly, or the component you are looking for is not rendered because of the props on your component, or there is some error during one of your component’s render methods.',
      );
    });

    it('throws an error if no callback found', () => {
      const action = mount(
        <Action
          handler={{
            name: 'noop',
            onAction: noop,
          }}
        />,
      );

      expect(() =>
        trigger(action.find('button'), 'onNonExistantAction'),
      ).toThrow(
        "No callback found at keypath 'onNonExistantAction'. Available props: type, onClick",
      );
    });
  });

  describe('findById', () => {
    it('finds an element with a matching ID', () => {
      const matchedNode = <div id="foo" />;
      const found = findById(
        mount(
          <>
            {matchedNode}
            <div id="bar" />
          </>,
        ),
        'foo',
      );

      expect(found.getElement()).toStrictEqual(matchedNode);
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

function withConsoleErrors(callback: () => void): unknown[] {
  const errors: unknown[] = [];
  const {error} = console;

  // eslint-disable-next-line no-console
  console.error = (...args) => {
    errors.push(...args);
    error.call(console, ...args);
  };

  try {
    callback();
  } finally {
    // eslint-disable-next-line no-console
    console.error = error;
  }

  return errors;
}
