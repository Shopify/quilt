# `@shopify/enzyme-utilities`

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
