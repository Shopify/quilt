# `@shopify/enzyme-utilities`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities)

Enzyme utilities for testing React components.

> **Note**: as of version 2.0, this library requires `react` and `react-dom` to be at least version 16.8.x.

## Installation

```bash
$ yarn add @shopify/enzyme-utilities
```

## API Reference

### `function trigger(wrapper: any, keypath: string, ...args: any[]): any`

Triggers the callback in the `props` of `wrapper` according to the `keypath` and with the provided `args`.

#### Example Usage

```typescript
import React from 'react';
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
import React from 'react';
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
