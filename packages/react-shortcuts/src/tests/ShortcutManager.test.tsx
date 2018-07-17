import * as React from 'react';
import {mount} from 'enzyme';
import {timer} from '@shopify/jest-dom-mocks';

import Key, {ModifierKey} from '../keys';
import Shortcut from '../Shortcut';
import ShortcutProvider from '../ShortcutProvider';

import ShortcutWithFocus from './ShortcutWithRef';

describe('ShortcutManager', () => {
  beforeEach(() => {
    timer.mock();
  });

  afterEach(() => {
    timer.restore();
  });

  it('calls the matching shortcut immediately if there are no other similar shortcuts', () => {
    const fooSpy = jest.fn();
    const barSpy = jest.fn();

    mount(
      <ShortcutProvider>
        <Shortcut key="foo" keys={['f', 'o', 'o']} onMatch={fooSpy} />
        <Shortcut key="bar" keys={['b', 'a', 'r']} onMatch={barSpy} />
      </ShortcutProvider>,
    );

    keydown('f');
    keydown('o');
    keydown('o');

    expect(fooSpy).toHaveBeenCalled();
  });

  it('calls multiple shortcuts', () => {
    const fooSpy = jest.fn();
    const barSpy = jest.fn();
    mount(
      <ShortcutProvider>
        <Shortcut key="foo" keys={['f', 'o', 'o']} onMatch={fooSpy} />
        <Shortcut key="bar" keys={['b', 'a', 'r']} onMatch={barSpy} />
      </ShortcutProvider>,
    );

    keydown('f');
    keydown('o');
    keydown('o');

    keydown('b');
    keydown('a');
    keydown('r');

    expect(fooSpy).toHaveBeenCalledTimes(1);
    expect(barSpy).toHaveBeenCalledTimes(1);
  });

  it('matches the longest fully matched shortcut when there are conflicting shortcuts after a timeout', () => {
    const fooSpy = jest.fn();
    const foSpy = jest.fn();
    const fSpy = jest.fn();

    mount(
      <ShortcutProvider>
        <Shortcut keys={['f', 'o', 'o']} onMatch={fooSpy} />
        <Shortcut keys={['f', 'o']} onMatch={foSpy} />
        <Shortcut keys={['f']} onMatch={fSpy} />
      </ShortcutProvider>,
    );

    keydown('f');
    keydown('o');

    expect(foSpy).not.toBeCalled();

    timer.runAllTimers();

    expect(fSpy).not.toHaveBeenCalled();
    expect(foSpy).toHaveBeenCalledTimes(1);
    expect(fooSpy).not.toHaveBeenCalled();
  });

  it('does not call shortcuts that do not match the keys pressed', () => {
    const spy = jest.fn();
    mount(
      <ShortcutProvider>
        <Shortcut keys={['b', 'a', 'r']} onMatch={spy} />
      </ShortcutProvider>,
    );

    keydown('b');
    keydown('a');
    keydown('z');

    expect(spy).not.toBeCalled();

    timer.runAllTimers();

    expect(spy).not.toBeCalled();
  });

  it('does not call shortcuts that only partially match', () => {
    const spy = jest.fn();
    mount(
      <ShortcutProvider>
        <Shortcut keys={['f', 'o', 'o']} onMatch={spy} />
        <Shortcut keys={['f']} onMatch={spy} />
      </ShortcutProvider>,
    );

    keydown('f');
    keydown('o');
    timer.runAllTimers();

    expect(spy).not.toBeCalled();
  });

  it('calls shortcuts that are scoped to a specific node only when that node is focused', () => {
    const spy = jest.fn();

    const app = mount(
      <ShortcutProvider>
        <ShortcutWithFocus spy={spy} />
      </ShortcutProvider>,
    );
    app.update();

    keydown('z');
    expect(spy).toBeCalled();
  });

  it('only registers a unique shortcut once', () => {
    const spy = jest.fn();

    mount(
      <ShortcutProvider>
        <Shortcut keys={['f', 'o', 'o']} onMatch={spy} />
        <Shortcut keys={['f', 'o', 'o']} onMatch={spy} />
      </ShortcutProvider>,
    );

    keydown('f');
    keydown('o');
    keydown('o');
    timer.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes keys when Shortcut unmounts', () => {
    const spy = jest.fn();

    const app = mount(
      <ShortcutProvider>
        <Shortcut keys={['b', 'a', 'r']} onMatch={spy} />
        <Shortcut keys={['f', 'o', 'o']} onMatch={spy} />
      </ShortcutProvider>,
    );

    app.unmount();

    keydown('f');
    keydown('o');
    keydown('o');

    keydown('b');
    keydown('a');
    keydown('r');

    expect(spy).not.toBeCalled();
  });

  it('resets keys when there are no matching shortcuts', () => {
    const spy = jest.fn();

    mount(
      <ShortcutProvider>
        <Shortcut keys={['?']} onMatch={spy} />
      </ShortcutProvider>,
    );

    keydown('Shift');
    keydown('a');
    keydown('?');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('allows default event to occur', () => {
    const spy = jest.fn();
    const event = {
      preventDefault: jest.fn(),
    };

    mount(
      <ShortcutProvider>
        <Shortcut keys={['a']} onMatch={spy} allowDefault />
      </ShortcutProvider>,
    );

    keydown('a', document, event);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).not.toBeCalled();
  });

  it('prevents the default event by default', () => {
    const spy = jest.fn();
    const event = {
      preventDefault: jest.fn(),
    };

    mount(
      <ShortcutProvider>
        <Shortcut keys={['a']} onMatch={spy} />
      </ShortcutProvider>,
    );

    keydown('a', document, event);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toBeCalled();
  });

  describe('modifier keys', () => {
    it('matches shortcut when all modifier keys are pressed', () => {
      const fooSpy = jest.fn();
      const modifierKeys: ModifierKey[] = ['Control', 'Shift', 'Alt', 'Meta'];

      mount(
        <ShortcutProvider>
          <Shortcut modifierKeys={modifierKeys} keys={['/']} onMatch={fooSpy} />
        </ShortcutProvider>,
      );

      keydown('/', document, {
        getModifierState: key => modifierKeys.includes(key),
      });

      expect(fooSpy).toHaveBeenCalled();
    });

    it('doesn’t match shortcut when all modifier keys not pressed', () => {
      const fooSpy = jest.fn();
      const modifierKeysToCheck: ModifierKey[] = [
        'Control',
        'Shift',
        'Alt',
        'Meta',
      ];

      mount(
        <ShortcutProvider>
          <Shortcut
            modifierKeys={modifierKeysToCheck}
            keys={['/']}
            onMatch={fooSpy}
          />
        </ShortcutProvider>,
      );

      const modifierKeysPressed: ModifierKey[] = ['Control', 'Shift', 'Hyper'];

      keydown('/', document, {
        getModifierState: key => modifierKeysPressed.includes(key),
      });

      expect(fooSpy).not.toHaveBeenCalled();
    });
  });
});

function keydown(key: Key | ModifierKey, target = document, eventSpies = {}) {
  let event = new KeyboardEvent('keydown', {
    key,
  });

  if (Object.getOwnPropertyNames(eventSpies).length !== 0) {
    event = Object.assign(event, eventSpies);
  }

  target.dispatchEvent(event);
}
