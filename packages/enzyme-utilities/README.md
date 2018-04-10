# `@shopify/enzyme-utilities`

Enzyme utilities for testing React components.

## Installation

```bash
$ yarn add @shopify/enzyme-utilities
```

## API Reference

### `function findByTestID(root: any, id: string): any`

Finds all nodes in `root` with a `testID` property matching the given `id` by strict equality.

#### Example Usage

```typescript
import * as React from 'react';
import MyComponent from '../MyComponent';
import {mount} from 'enzyme';
import {findByTestID} from '@shopify/enzyme-utilities';

describe('<MyComponent />', () => {
  it('renders the foo thing', () => {
    const myComponent = mount(<MyComponent />);

    expect(findByTestID(myComponent, 'Foo')).toHaveLength(1);
  });
});
```

### `function matchByTestID(root: any, regexp: RegExp): any`

Finds all nodes in `root` with a `testID` property matching the given `regexp`.

#### Example Usage

```typescript
import * as React from 'react';
import MyComponent from '../MyComponent';
import {mount} from 'enzyme';
import {matchByTestID} from '@shopify/enzyme-utilities';

describe('<MyComponent />', () => {
  it('renders the foo-n thing for some n', () => {
    const myComponent = mount(<MyComponent />);

    const fooN = /foo-[1-9]+[0-9]*/;

    expect(matchByTestID(myComponent, fooN)).toHaveLength(1);
  });
});
```

### `function trigger(wrapper: any, keypath: string, ...args: any[]): any`

Triggers the callback in the `props` of `wrapper` according to the `keypath` and with the provided `args`.

#### Example Usage

```typescript
import * as React from 'react';
import MyComponent, {Emotion, Panic} from '../MyComponent';
import {mount} from 'enzyme';
import {trigger} from '@shopify/enzyme-utilities';

describe('<MyComponent />', () => {
  it('panics when its Emotions feel triggered', () => {
    const myComponent = mount(<MyComponent />);

    trigger(myComponent.find(Emotion), 'handleFeeling', 'triggered');

    expect(myComponent.find(Panic)).toHaveLength(1);
  });
});
```

#### Usage with asynchronous callbacks

The `trigger` function automatically handles updating the Enzyme instance both immediately as well as after the promise has resolved:

```typescript
import * as React from 'react';
import MyComponent, {Emotion, Panic} from '../MyComponent';
import {mount} from 'enzyme';
import {trigger} from '@shopify/enzyme-utilities';

describe('<MyComponent />', () => {
  it('panics after a slight pause when its Emotions feel triggered', () => {
    const myComponent = mount(<MyComponent />);

    const pause = trigger(
      myComponent.find(Emotion),
      'handleFeeling',
      'triggered',
    );

    expect(myComponent.find(Panic)).toHaveLength(0);

    await pause;

    expect(myComponent.find(Panic)).toHaveLength(1);
  });
});
```
