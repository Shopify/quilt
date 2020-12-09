# `@shopify/react-shortcuts`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shortcuts.svg)](https://badge.fury.io/js/%40shopify%2Freact-shortcuts) ![bundle size badge](https://img.shields.io/bundlephobia/minzip/@shopify/react-shortcuts.svg)

Declarative and performant library for matching shortcut combinations in React applications.

## Installation

```bash
$ yarn add @shopify/react-shortcuts
```

## Usage

The library exposes three main parts, `<ShortcutProvider />`, `<Shortcut />` and `ShortcutManager`.

### ShortcutProvider

Wrapping your application in a `<ShortcutProvider />` allows you to use `<Shortcut />` components anywhere in your application, internally sharing a single `ShortcutManager` instance to minimize listeners and collisions.

```ts
// App.ts

import React from 'react';
import {ShortcutProvider} from '@shopify/react-shortcuts';

export default function App() {
  <ShortcutProvider>{/* the rest of your app */}</ShortcutProvider>;
}
```

### Shortcut

Shortcut is used to register a new keyboard shortcut to `ShortcutManager`. It can be triggered globally or only when a node is focused.

**Note: a `<Shortcut />` must have a `<ShortcutProvider />` somewhere above it in the tree.**

#### API

```ts
export interface Props {
  /*
    keys that, when pressed sequentially, will trigger `onMatch`
  */
  ordered: Key[];
  /*
    modifier keys that need to be kept pressed along with `keys` to trigger `onMatch`
  */
  held?: HeldKey;
  /*
    a callback that will trigger when the key combination is pressed
  */
  onMatch(matched: {ordered: Key[]; held?: ModifierKey[]}): void;
  /*
    a node that, when supplied, will be used to only fire `onMatch` when it is focused
  */
  node?: HTMLElement | null;
  /*
    a boolean that lets you temporarily disable the shortcut
  */
  ignoreInput?: boolean;
  /*
    a boolean that lets you opt out of swallowing the key event and let it propagate
  */
  allowDefault?: boolean;
}
```

#### Basic example

```ts
// MyComponent.tsx

import React from 'react';
import {Shortcut} from '@shopify/react-shortcuts';

export default function MyComponent() {
  return (
    <div>
      {/* some app markup here */}
      <Shortcut ordered={['f', 'o', 'o']} onMatch={() => console.log('foo')} />
    </div>
  );
}
```

#### With modifier keys

```ts
// MyComponent.tsx

import React from 'react';
import {Shortcut} from '@shopify/react-shortcuts';

export default function MyComponent() {
  return (
    <div>
      {/* some app markup here */}
      <Shortcut
        held={['Control', 'Shift']}
        ordered={['B']}
        onMatch={() => console.log('bar!')}
      />
    </div>
  );
}
```

You may also want to provide alternate groupings of `held` modifier keys. For example, “undo/redo” key combos are slightly different on Windows vs Mac OS. The below example will register `onMatch` if either `Control + z` or `Meta + z` is pressed simultaneously.

```ts
// MyComponent.tsx

import React from 'react';
import {Shortcut} from '@shopify/react-shortcuts';

export default function MyComponent() {
  return (
    <div>
      {/* some app markup here */}
      <Shortcut
        held={[['Control'], ['Meta']]}
        ordered={['z']}
        onMatch={() => console.log('undo!')}
      />
    </div>
  );
}
```

**Some Gotchas**

1. `Meta` refers to the “Command” key on Mac keyboards.
2. `Fn` and `FnLock` keys are not supported because they don't produce events, as mentioned in the [spec](https://w3c.github.io/uievents-key/#key-Fn)

#### On a focused node

Provide a node in the form of a `ref`. `<Shortcut />` will automatically subscribe to the `ShortcutManager` once the node is available.

```ts
// MyComponent.tsx

import React from 'react';
import {Shortcut} from '@shopify/react-shortcuts';

class MyComponent extends React.Component {
  state = {};

  render() {
    const {fooNode} = this.state;
    return (
      <div>
        <button ref={node => this.setState({fooNode: node})} />
        <Shortcut
          node={fooNode}
          ordered={['f', 'o', 'o']}
          onMatch={() => console.log('foo')}
        />
      </div>
    );
  }
}
```

### useShortcut

`<Shortcut />` invokes a hook, `useShortcut()`, under the hood. This hook is also available for use from this package. It will also register a new keyboard shortcut to the `ShortcutManager` and the API is very similar.

#### API

```ts
function useShortcut(
  // All inputs are the same as the above definitions for the props to <Shortcut />
  ordered: Key[],
  onMatch: (matched: {ordered: Key[]; held?: HeldKey}) => void,
  options: {
    held?: HeldKey;
    node?: HTMLElement | null;
    ignoreInput?: boolean;
    allowDefault?: boolean;
  } = {},
);
```

#### Basic example

The below example illustrates the same basic functionality as the `<Shortcut />` example above. However, it uses the `useShortcut()` hook and the component has been removed.

```ts
// MyComponent.tsx

import React from 'react';
import {useShortcut} from '@shopify/react-shortcuts';

export default function MyComponent() {
  useShortcut(['f', 'o', 'o'], () => console.log('foo'));

  return <div>{/* some app markup here */}</div>;
}
```

### ShortcutManager

`ShortcutManager` is created by `ShortcutProvider` and handles the logic for calling the appropriate shortcut callbacks and avoiding conflicts. You should never need to use it directly in application code, though you may want access to it in tests.

#### Example jest test

Given a component implementing a `<Shortcut />`

```ts
// MyComponent.tsx

export default function MyComponent() {
  return (
    <div>
      {/* some app markup here */}
      <Shortcut ordered={['f', 'o', 'o']} onMatch={() => console.log('foo')} />
    </div>
  );
}
```

you might want to add a `ShortcutManager` to it's context in an enzyme test to prevent errors

```ts
// MyComponent.test.tsx

import React from 'react';
import {mount} from 'enzyme';
import {ShortcutManager, Shortcut} from '@shopify/react-shortcuts';

import MyComponent from './MyComponent';

describe('my-component', () => {
  it('renders a shortcut for f,o,o', () => {
    const component = mount(<MyComponent />, {
      context: {shortcutManager: new ShortcutManager()},
    });

    const shortcut = component.find(Shortcut);

    expect(shortcut.prop('ordered')).toEqual(['f', 'o', 'o']);
  });
});
```
