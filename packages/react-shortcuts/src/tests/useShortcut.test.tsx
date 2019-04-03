import * as React from 'react';
import {mount} from '@shopify/react-testing';
import Key, {ModifierKey, HeldKey} from '../keys';
import {useShortcut} from '../Shortcut';

import ShortcutProvider from '../ShortcutProvider';

describe('useShortcut()', () => {
  function MockComponent({ordered, spy, ...options}) {
    useShortcut(ordered, spy, options);
    return null;
  }

  it('calls the onMatch callback with the ordered keys when they are pressed', () => {
    const ordered = ['k', 'j'];
    const spy = jest.fn();
    const wrapper = mount(
      <ShortcutProvider>
        <MockComponent ordered={ordered} spy={spy} />
      </ShortcutProvider>,
    );

    pressKeys(wrapper, ordered);

    expect(spy).toHaveBeenCalledWith({held: undefined, ordered});
  });

  it('unsubscribes keys when component with hook unmounts', () => {
    const spy = jest.fn();
    const ordered1 = ['b', 'a', 'r'];
    const ordered2 = ['f', 'o', 'o'];

    const wrapper = mount(
      <ShortcutProvider>
        <MockComponent key="bar" ordered={ordered1} spy={spy} />
        <MockComponent key="foo" ordered={ordered2} spy={spy} />
      </ShortcutProvider>,
    );

    wrapper.unmount();

    pressKeys(wrapper, ordered1);
    pressKeys(wrapper, ordered2);

    expect(spy).not.toBeCalled();
  });

  it('calls the onMatch callback with held keys when they are pressed', () => {
    const ordered = ['k', 'j'];
    const held: HeldKey = ['Control', 'Shift', 'Alt', 'Meta'];
    const spy = jest.fn();
    const wrapper = mount(
      <ShortcutProvider>
        <MockComponent ordered={ordered} spy={spy} held={held} />
      </ShortcutProvider>,
    );

    pressKeys(wrapper, ordered, held);

    expect(spy).toHaveBeenCalledWith({held, ordered});
  });
});

function pressKeys(wrapper, keys, held?: HeldKey) {
  const spies = held ? {getModifierState: key => held.includes(key)} : {};
  wrapper.act(() =>
    keys.forEach(key => {
      keydown(key, document, spies);
    }),
  );
}

function keydown(key: Key | ModifierKey, target = document, eventSpies = {}) {
  let event = new KeyboardEvent('keydown', {
    key,
  });

  if (Object.getOwnPropertyNames(eventSpies).length !== 0) {
    event = Object.assign(event, eventSpies);
  }

  target.dispatchEvent(event);
}
