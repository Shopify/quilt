# `@shopify/react-hydrate`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-hydrate.svg)](https://badge.fury.io/js/%40shopify%2Freact-hydrate.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-hydrate.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-hydrate.svg)

Utilities for hydrating server-rendered React apps.

## Installation

```bash
$ yarn add @shopify/react-hydrate
```

## Usage

This library is intended to assist with "progressive hydration", a pattern where you fully render an application on the server, but wait to hydrate parts of it when it reaches the client. Typically, doing different work on the server and client would result in the server markup being thrown out. This library avoids that issue by rendering a wrapping `div` around the content on the server, adding an ID to that element, and setting the `dangerouslySetInnerHTML` prop on the client to the resulting server markup in order to avoid mismatches. Once you have done whatever work on the client to load the necessary components, this hardcoded markup is removed, allowing the React tree to take over.

### Server

There are two key pieces to making this work. First, your server must render a `HydrationContext.Provider` element around your React tree (to be clear: this is only required for the server, not on the client). This element will provide a `HydrationManager` to the three, which manages the identifiers that map server markup to client markup.

```tsx
import React from 'react';
import {render} from 'react-dom';
import {HydrationContext, HydrationManager} from '@shopify/react-hydration';
import App from '../app';

export async function middleware(ctx, next) {
  const hydrationManager = new HydrationManager();

  ctx.body = render(
    <HydrationContext.Provider value={hydrationManager}>
      <App />
    </HydrationContext.Provider>,
  );

  await next();
}
```

Note that if you use [`@shopify/react-effect`](../react-effect), you **must** reset the manager after each rendering pass (otherwise the identifiers will not match between client and server). You must also use a new `HydrationManager` for every request to prevent identifiers leaking between different requests.

```tsx
import React from 'react';
import {render} from 'react-dom';
import {extract} from '@shopify/react-effect';
import {HydrationContext, HydrationManager} from '@shopify/react-hydration';
import App from '../app';

export async function middleware(ctx, next) {
  const hydrationManager = new HydrationManager();
  const app = <App />;

  await extract(app, {
    decorate(element) {
      return (
        <HydrationContext.Provider value={hydrationManager}>
          {element}
        </HydrationContext.Provider>
      );
    },
    afterEachPass() {
      hydrationManager.reset();
    },
  });

  ctx.body = render(
    <HydrationContext.Provider value={hydrationManager}>
      <App />
    </HydrationContext.Provider>,
  );

  await next();
}
```

### Application

Once the server is in place, you can start to use the `Hydrator` component. This component will do different things depending on its children:

- If children are passed (the server-side case), render those children normally, but inside of a `div` with an identifier that can be matched on the client.
- If children are not passed (the client-side case, because this is only used in cases where you will not have the code available to you on the client to render the same markup that was present on the server), render a `div` with `dangerouslySetInnerHTML` set to be the HTML of the original, server-rendered markup.

> Note: you probably don’t need to know the internals of how progressive hydration works, unless you’re really interested. This package will primarily be used by other tools that manage asynchronous component loading, such as [`@shopify/react-async`](../react-async).

```tsx
import React, {useState, useEffect} from 'react';
import {Hydrator} from '@shopify/react-hydrate';

// This is a hypothetical component that knows how to load a component
// asynchronously, but can also potentially access it synchronously on the
// server. So, the server will immediately have access to the component and
// can render it for the initial page load, but the client will have to wait
// until it is loaded asynchronously. The Hydrator component stands in the middle
// to bridge the gap and prevent the server markup from being thrown away.

function MyComponent() {
  const [ProgressivelyHydratedComponent, setComponent] = useState(() =>
    tryToAccessModuleSynchronously(),
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      const Component = await loadModuleAsynchronously();
      if (mounted) {
        setComponent(Component);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return ProgressivelyHydratedComponent ? (
    <Hydrator>
      <ProgressivelyHydratedComponent />
    </Hydrator>
  ) : (
    <Hydrator />
  );
}
```

You can optionally pass an `id` prop, which will be used to prefix the identifier used to match server and client markup (if the application behaves well, this should be unnecessary, but it can prevent any issues where multiple hydrated components of different types render in a different order across server and client).
