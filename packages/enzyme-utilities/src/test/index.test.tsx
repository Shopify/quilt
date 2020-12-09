import React from 'react';
import {mount} from 'enzyme';

import {Toggle, Button, Status} from './fixtures/Toggle';
import {ActionList, Action} from './fixtures/Actions';

import {trigger, findById} from '..';

function noop() {}

jest.mock('react-dom/test-utils', () => {
  const actualTestUtilities = jest.requireActual('react-dom/test-utils');

  return {
    ...actualTestUtilities,
    act: jest.fn(actualTestUtilities.act),
  };
});

const {act} = jest.requireMock('react-dom/test-utils') as {act: jest.Mock};

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

    it('returns the value when the callback is not a promise', () => {
      const mockReturnValue = 'foo';
      const spy = jest.fn(() => mockReturnValue);
      const toggle = mount(<Toggle onToggle={spy} />);

      const returnValue = trigger(toggle.find('button'), 'onClick');
      expect(returnValue).toBe(mockReturnValue);
    });

    it('returns the value when the callback is a promise', async () => {
      const mockReturnValue = 'foo';
      const spy = jest.fn(() => mockReturnValue);
      const toggle = mount(<Toggle onToggle={spy} deferred />);

      const returnValue = await trigger(toggle.find('button'), 'onClick');
      expect(returnValue).toBe(mockReturnValue);
    });

    it('updates root with synchronous functions', () => {
      const spy = jest.fn();
      const toggle = mount(<Toggle onToggle={spy} />);

      expect(toggle.find(Button).prop('status')).toBe(Status.Active);
      trigger(toggle.find(Button), 'onClick');

      expect(toggle.find(Button).prop('status')).toBe(Status.Inactive);
      expect(spy).toHaveBeenCalled();
    });

    it('updates root with asynchronous functions', async () => {
      const spy = jest.fn();
      const toggle = mount(<Toggle onToggle={spy} deferred />);

      expect(toggle.find(Button).prop('status')).toBe(Status.Active);
      const promise = trigger(toggle.find(Button), 'onClick');

      expect(toggle.find(Button).prop('status')).toBe(Status.InTransition);
      await promise;

      expect(toggle.find(Button).prop('status')).toBe(Status.Inactive);
      expect(spy).toHaveBeenCalled();
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
