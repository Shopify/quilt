# `@shopify/react-shortcuts`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
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

import * as React from 'react';
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
    keys that need to be kept pressed along with `keys` to trigger `onMatch`
  */
  held?: ModifierKey[];
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

import * as React from 'react';
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

import * as React from 'react';
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

#### On a focused node

Provide a node in the form of a `ref`. `<Shortcut />` will automatically subscribe to the `ShortcutManager` once the node is available.

```ts
// MyComponent.tsx

import * as React from 'react';
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

import * as React from 'react';
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
