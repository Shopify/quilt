# `@shopify/react-effect`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-effect.svg)](https://badge.fury.io/js/%40shopify%2Freact-effect.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-effect.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-effect.svg)

This package contains a component and set of utilities for performing multiple effects during a single pass of server-side rendering in a universal React application.

## Installation

```bash
yarn add @shopify/react-effect
```

## Usage

### `useServerEffect()`

This package is largely built around a hook, `useServerEffect`. The only mandatory argument is a function, which is the "effect" you wish to perform during each pass of server rendering:

```tsx
import {useServerEffect} from '@shopify/react-effect';

export default function MyComponent() {
  useServerEffect(() => console.log('Doing something!'));
  return null;
}
```

This callback can return anything, but returning a promise has a special effect: it will be waited for on the server when calling `extract()`.

This hook also accepts a second, optional argument: the effect "kind". This should be an object that:

- Must have an `id` that is a unique symbol
- Optionally has `betweenEachPass` and/ or `afterEachPass` functions that add additional logic to the `betweenEachPass` and `afterEachPass` options for `extract()`

### `<Effect />`

This is a component version of `useServerEffect`. Its `perform` prop will be run as a server effect, and its `kind` prop is used as the second argument to `useServerEffect`. Where possible, prefer the `useServerEffect` hook.

### `extract()`

You can call `extract()` on a React tree in order to perform all of the effects within that tree. This function repeatedly calls a render function (by default, `react-dom`’s `renderToStaticMarkup`), collects any `Effect` promises and, if there are promises, waits on them before performing another pass. This process ends when no more promises are collected during a pass of your tree.

> **Note**: this flow is significantly different from the previous version, which relied on a custom tree walk. Calling `extract()` no longer waits for promises collected higher in the tree before processing the rest. Instead, it relies on multiple passes, which gives application code the option to process promises at many layers of the app in parallel, rather than in sequence.

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

You may optionally pass an options object that contains the following keys (all of which are optional):

- `include`: an array of symbols that should be collected during tree traversal. These IDs must align with the `kind.id` field on `<Extract />` elements in your application.

  ```tsx
  import {renderToString} from 'react-dom/server';
  import {EFFECT_ID as I18N_EFFECT_ID} from '@shopify/react-i18n';
  import {extract} from '@shopify/react-effect/server';

  async function app(ctx) {
    const app = <App />;
    // will only perform @shopify/react-i18n extraction
    await extract(app, {include: [I18N_EFFECT_ID]});
    ctx.body = renderToString(app);
  }
  ```

- `maxPasses`: a number that limits the number of render/ resolve cycles `extract` is allowed to perform. This option defaults to `5`.

- `afterEachPass`: a function that is called after each pass of your tree, regardless of whether traversal is "finished". This function can return a promise, and it will be waited on before continuing. This function is called with the same argument as the `betweenEachPass` option. Returning `false` (or a promise for `false`) from this method will bail out of subsequent passes.

- `betweenEachPass`: a function that is called after a pass of your tree that did not "finish" (that is, there were still promises that got collected, and we are still less than `maxPasses`). This function can return a promise, and it will be waited on before continuing. It is called with a single argument: a `Pass` object, which contains the `index`, `finished`, `cancelled` (`maxPasses` reached), `renderDuration` and `resolveDuration` of the just-completed pass. If there is another pass to perform, this method is called **after** `afterEachPass`.

- `decorate`: a function that takes the root React element in your tree and returns a new tree to use. You can use this to wrap your application in context providers that only your server render requires.

  ```tsx
  import {renderToString} from 'react-dom/server';
  import {extract} from '@shopify/react-effect/server';
  import {HtmlContext, HtmlManager} from '@shopify/react-html/server';

  async function app(ctx) {
    const htmlManager = new HtmlManager();
    const app = <App />;

    await extract(app, {
      decorate(element) {
        return (
          <HtmlContext.Provider value={htmlManager}>
            {element}
          </HtmlContext.Provider>
        );
      },
    });

    ctx.body = renderToString(app);
  }
  ```

- `renderFunction`: an alternative function to `renderToStaticMarkup` for traversing the tree.

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
        {(manager) => <Effect perform={() => (manager.value = true)} />}
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
        {(manager) => <Effect perform={() => (manager.value = true)} />}
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
