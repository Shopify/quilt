# `@shopify/enzyme-utilities`

[![CircleCI](https://circleci.com/gh/Shopify/quilt.svg?style=svg&circle-token=8dafbec2d33dcb489dfce1e82ed37c271b26aeba)](https://circleci.com/gh/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities)

Enzyme utilities for testing React components.

## Installation

```bash
$ yarn add @shopify/enzyme-utilities
```

## API Reference

### `function trigger(wrapper: any, keypath: string, ...args: any[]): any`

Triggers the callback in the `props` of `wrapper` according to the `keypath` and with the provided `args`.

#### Example Usage

```typescript
import * as React from 'react';
import MyComponent, {Button, Thing} from '../MyComponent';
import {mount} from 'enzyme';
import {trigger} from '@shopify/enzyme-utilities';

describe('<MyComponent />', () => {
  it('shows a Thing when its Button it clicked', () => {
    const myComponent = mount(<MyComponent />);
    trigger(myComponent.find(Button), 'onAction');

    expect(myComponent.find(Thing)).toHaveLength(1);
  });
});
```

#### Usage with asynchronous callbacks

The `trigger` function automatically handles updating the Enzyme instance both immediately as well as after the promise has resolved:

```typescript
import * as React from 'react';
import MyComponent, {Button, Thing} from '../MyComponent';
import {mount} from 'enzyme';
import {trigger} from '@shopify/enzyme-utilities';

describe('<MyComponent />', () => {
  it('shows a Thing after a pause when its Button it clicked', () => {
    const myComponent = mount(<MyComponent />);
    const pause = trigger(myComponent.find(Button), 'onAction');
    expect(myComponent.find(Thing)).toHaveLength(0);

    await pause;
    expect(myComponent.find(Thing)).toHaveLength(1);
  });
});
```

### `function addMountedWrapper(wrapper: ReactWrapper<any, any>): void`

Adds an enzyme wrapper to a tracked list of mounted wrappers. These wrappers can later be unmounted via `unmountAllWrappers` (see below).

### `function unmountAllWrappers(): void`

Unmounts all wrappers previously registered via `addMountedWrapper`. This can be used in a global `afterEach` hook with the following caveat:

> Usually, you can
> rely on running this once for the entire suite after each test
> (and its nested hooks) have been run. However, in some cases you may
> need to run this manually. This is most commonly needed when your
> component uses timeouts/ animation frames that you mock out for tests,
> and waiting until after you have restored those globals will lead
> to their stored identifiers for the timeout or animation frame to
> be invalid.

### `function mount<P, S = any>(node: ReactElement<P>, options?: MountRendererProps | undefined): ReactWrapper<P, S>`

A custom `mount` function mirorring `enzyme`'s `mount` function, but with automatic tracking of mounted nodes via `addMountedWrapper`. These can later be unmounted as described above.
