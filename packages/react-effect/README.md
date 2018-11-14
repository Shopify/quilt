# `@shopify/react-effect`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-effect.svg)](https://badge.fury.io/js/%40shopify%2Freact-effect.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-effect.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-effect.svg)

This package contains a component and set of utilities for performing multiple effects during one single pass of server rendering in a universal React application.

## Installation

```bash
$ yarn add @shopify/react-effect
```

## Usage

### `<Effect />`

This package is largely built around a component, `Effect`. To set up an action to be performed, use the `perform` prop:

```tsx
import {Effect} from '@shopify/react-effect';

export default function MyComponent() {
  return <Effect perform={() => console.log('Doing something!')} />;
}
```

By default, this callback will run in two ways:

- On the client, during `componentDidMount`
- On the server, when called using the [`extract`](#extract) function documented below

This callback can return anything, but returning a promise has a special effect: it will be waited for on the server when calling `extract()`.

This component accepts three additional optional properties:

- `kind`: a symbol detailing the "category" of the effect. This will be used to optionally skip some categories when calling `extract()`
- `clientOnly`: will only call the effect in `componentDidMount`, not when extracting on the server
- `serverOnly`: will only call the effect during extraction, not in `componentDidMount`

This component also accepts children which are rendered as-is.

### `extract()`

You can call `extract()` on a React tree in order to perform all of the effects within that tree. This function uses the [`react-tree-walker`](https://github.com/ctrlplusb/react-tree-walker) package to perform the tree walk, which creates some implications for the return value of your `perform` actions:

- Returning a promise will wait on the promise before processing the rest of the tree
- Returning `false` will prevent the rest of the tree from being processed

This function returns a promise that resolves when the tree has been fully processed.

```tsx
import {renderToString} from 'react-dom/server';
import {extract} from '@shopify/react-effect/server';

async function app(ctx) {
  const app = <App />;
  await extract(app);
  ctx.body = renderToString(app);
}
```

You may optionally pass a second argument to this function: an array of symbols representing the categories to include in your processing of the tree (matching the `kind` prop on `Extract` components).

```tsx
import {renderToString} from 'react-dom/server';
import {EFFECT_ID as I18N_EFFECT_ID} from '@shopify/react-i18n';
import {extract} from '@shopify/react-effect/server';

async function app(ctx) {
  const app = <App />;
  // will only perform @shopify/react-i18n extraction
  await extract(app, [I18N_EFFECT_ID]);
  ctx.body = renderToString(app);
}
```

### Custom extractable components

Usually, the `Extract` component will do what you need, but you may occasionally need your own component to directly implement the "extractable" part. This can be the case when your component must do something in `extract` that ends up calling `setState`. In these cases, you can use two additional exports from this module, `METHOD_NAME` and the `Extractable` interface, to manually implement a method that will be called during extraction:

```ts
import {METHOD_NAME, Extractable} from '@shopify/react-effect';

export const EFFECT_ID = Symbol('MyComponentEffect');

class MyComponent extends React.Component implements Extractable {
  [METHOD_NAME](include: boolean | symbol[]) {
    // When implementing your own version of this, you should
    // implement your own check for the effect "kind". The
    // Effect component does this automatically.
    if (
      include === true ||
      (Array.isArray(include) && include.includes(EFFECT_ID))
    ) {
      this.setState({extracting: true});
    }
  }
}
```

## Gotchas

A common mistake is initializing a provider entirely within your application component, and setting some details on this provider during the extraction. There is nothing implicitly wrong with this, but it will usually not have the effect you are after. When you call `renderToString()` to actually generate your HTML, the app will be reinitialized, and all of the work you did in the extraction call will be lost. To avoid this, pass any "stateful" managers/ providers into your application:

```tsx
class StatefulManager {}
const {Provider, Consumer} = React.createContext();

// bad
export default function App() {
  return (
    <Provider value={new StatefulManager()}>
      <Consumer>
        {manager => <Effect perform={() => (manager.value = true)} />}
      </Consumer>
    </Provider>
  );
}

const app = <App />;
await extract(app);

// All your work is lost now, because the components are reinitialized
renderToString(app);

// good
export default function App({manager}) {
  return (
    <Provider value={manager}>
      <Consumer>
        {manager => <Effect perform={() => (manager.value = true)} />}
      </Consumer>
    </Provider>
  );
}

const manager = new StatefulManager();
const app = <App manager={manager} />;
await extract(app);

// All your work is preserved, because you passed in the same manager
renderToString(app);
```
