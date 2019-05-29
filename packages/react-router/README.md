# `@shopify/react-router`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-router.svg)](https://badge.fury.io/js/%40shopify%2Freact-router)

A universal router for React with first-class support for the [WHATWG `URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) and prefetching.

## Installation

```bash
$ yarn add @shopify/react-router
```

## Usage

### `<Router />`

Creates a router that is provided to the rest of the React tree. This router powers the `useCurrentUrl()` and `useRouter()` hooks and, by extension, the rest of the features of this library. On the client, you should render a `Router` with no props. On the server, you should pass in the `url` prop, which is a `URL` object that represents the current location to simulation.

```tsx
// Example in Koa...

const app = new Koa();
app.use((ctx) => {
  ctx.body = renderToString(
    <Router url={ctx.URL}>
      <App />
    </Router>,
  );
});
```

This component basically just composes the `Prefetcher` component, serialization for the `NoMatch` component, alongside a number of context providers (`RouterContext`, `CurrentUrlContext`). If you wish to omit some features from your final bundle, you can skip the `Router` component and render those primitives instead.

### `<Route />`

Interacts with the `Router` instance to register behavior when the location matches a URL. There is only one mandatory prop, `match`, which specifies the URL to match. This prop can be one of the following:

- a `string`, in which case it will match any URL with a pathname that exactly matches, or that exactly matches except for a trailing `/`,
- a `RegExp`, in which case it will match any URL with a pathname that matches the regex, or,
- a function that takes an [`EnhancedURL` object](#enhancedurl), and returns a boolean indicating whether or not to match.

A `<Route />` can then specify the behavior to use for the matching URLs by specifying any set of the following props:

- `render`: a function that is called with an `EnhancedURL` object, and returns JSX to use when the route matches.
- `renderPrefetch`: a function that is called with a `URL` object, and returns JSX to render when the route is [prefetched](#prefetcher).
- `redirect`: any value accepted by the [`Redirect` component’s `to` prop](#redirect), which will be used to render a `Redirect` component when the route matches (should not be provided if `render` is also specified).

The following example shows a component created by [`@shopify/react-async`](https://github.com/Shopify/quilt/tree/master/packages/react-async) that is rendered and prefetched when the current path is exactly `/products` or `/products/`:

```tsx
import React from 'react';
import {Route} from '@shopify/react-router';
import {createAsyncComponent} from '@shopify/react-async';

const Products = createAsyncComponent({
  load: () => import('./Products'),
});

export function ProductsRoute() {
  return (
    <Route
      match="/products"
      render={() => <Products />}
      renderPrefetch={() => <Products.Prefetch />}
    />
  );
}
```

This example shows how to extract a part of the path from the URL that your component needs to know (in this case, an ID in the form `/products/ID`):

```tsx
import React from 'react';
import {Route} from '@shopify/react-router';
import Product from './Product';

const PRODUCT_MATCH = /^\/products\/(\d+)(\/|$)/;

export function ProductRoute() {
  return (
    <Route
      match={PRODUCT_MATCH}
      render={(url) => {
        const match = url.pathname.match(PRODUCT_MATCH);
        return <Product id={match ? match[1] : undefined} />;
      }}
    />
  );
}
```

This example shows how to redirect a user from `/` to `/home`:

```tsx
import React from 'react';
import {Route} from '@shopify/react-router';

export function RootRoute() {
  return <Route match="/" redirect="/home" />;
}
```

### `<Link />`

The `Link` component renders a native anchor tag pointing at a page in your application. When this anchor is activated, a client-side navigation will be performed instead of a full-page navigation. However, should JavaScript fail to load, or if JavaScript is still being downloaded, it will still let the user navigate the application. This component also knows when the user is intending to open a link in a new tab or window, and will allow that navigation to behave normally.

The `Link` component accepts all props you could pass to an anchor element, except for `href`. In place of `href`, this component accepts a `to` prop, which can be any type allowed by [`router.navigate`](#router-navigate).

```tsx
import {Link} from '@shopify/react-router';

export function MyComponent() {
  return <Link to={{pathname: '/products/new'}}>Create product</Link>;
}
```

### `useCurrentUrl()`

Components in your application will often want to know the current URL. This can be particularly useful in cases like analytics, where you want to trigger an event every time the URL changes. The `useCurrentUrl()` hook gives components access to the current `EnhancedURL` (a `URL` representing the current location with an additional `state` field for the current location state). This hook will re-render your component whenever the current URL changes.

```tsx
import {useEffect} from 'react';
import {useCurrentUrl} from '@shopify/react-router';

function useNavigationTracking() {
  const currentUrl = useCurrentUrl();

  useEffect(() => {
    trackButNotInACreepyWayPlease(currentUrl.href);
  }, [currentUrl]);
}
```

You may be tempted to use this hook in components nested under a `Route` to get details about the URL, such as the path or querystring. While this use case is completely valid, it can make the application feel overly coupled to the URL in ways that are hard to understand. An alternative approach extracts those details just once, in the `Route`’s `render` prop, passes it in to the "top level" component, which can then distribute those details to its children through props or context:

```tsx
import {Route} from '@shopify/react-router';

function MyComponent({create = false, prefillTitle = ''}) {
  // Use the props, just like you do for any other prop!
}

function MyComponentRoute() {
  return (
    <Route
      match={/^\/resource(\/new)?/}
      render={({pathname, searchParams}) => (
        <MyComponent
          create={pathname.contains('/new')}
          prefillTitle={searchParams.get('prefillTitle')}
        />
      )}
    />
  );
}
```

#### `EnhancedURL`

This library is driven by a the `URL` object. In order to support features like location state, however, most of this library operates on `EnhancedURL` objects. These objects are identical to a `URL` object except for the following additions:

- All members should be considered immutable
- An additional `state` field is provided, which is the location state of the location the object represents

### `useRouter()`

Not all navigation happens by users clicking on links. Applications often need to programmatically navigate in response to things like resources being created or updated. `@shopify/react-router` provides the `useRouter` hook for this purpose. The hook provides the singleton router instance.

```tsx
import React from 'react';
import {useRouter} from '@shopify/react-router';

function MyComponent() {
  const router = useRouter();
  return (
    <CreateProduct onComplete={(id) => router.navigate(`/products/${id}`)} />
  );
}
```

The router instance has the following methods:

#### `router.navigate()`

`router.navigate()` is the main method of the router. It allows you to add or replace an entry in the navigation stack. The first argument is a description of the location to push to, and can be one of the following:

- A string, which should be a relative or absolute pathname, search, and hash,
- A `URL` object (**note:** must be on the same origin as the current URL),
- An object with optional `pathname`, `hash`, and `search` fields, or
- A function that accepts the current URL, and returns one of the other arguments above

The second argument is an optional object any of the following keys:

- `state`, an object that will be used as location state, and available on `router.currentUrl.state` (or `useCurrentUrl().state`)
- `replace`, a boolean indicating that this navigation should replace the existing entry in the navigation stack (by default, `navigate` will push a new entry onto the stack)

```tsx
// Relative navigation, adds `/new` to the path
router.navigate('new');

// Absolute navigation, goes the /next/page directly
router.navigate('/next/page');

// Replaces instead of pushes to the navigation stack
router.navigate('/next/page?replace=1', {replace: true});

// This search object will be URI-encoded
router.navigate({pathname: '/', search: {goto: 'new-page'}});

// This will compote a new URL from the current one
router.navigate((currentUrl) => {
  const newUrl = new URL(currentUrl.href);
  newUrl.searchParams.append('extra', 'param');
  return newUrl;
});
```

#### `router.go()`

Allows you to go forwards or backwards through the navigation stack. Accepts an integer for the number of entries to move; negative numbers move backwards.

```tsx
// Back one page
router.go(-1);

// Forward three pages
router.go(3);
```

#### `router.forward()`

An alias for `router.go(1)`.

#### `router.back()`

An alias for `router.go(-1)`.

#### `router.block()`

Blocks the router from performing additional navigations. In general, avoid this method, and use the `useNavigationBlock` hook or `NavigationBlock` component instead.

#### `router.listen()`

Subscribes to changes in the current URL. In general, avoid this method, and use the `useCurrentUrl` hook (and changes to the value it provides) instead.

### `useNavigationBlock()` and `<NavigationBlock />`

Applications sometimes need to block the user from being able to navigate away. While it is generally better to save the state of the page and rehydrate it when the user returns, this is not always possible. `@shopify/react-router` provides a mechanism for blocking all navigation, including the browser’s native back and forward buttons.

The `useNavigationBlock` hook allows you to register a function that can block navigation. This function is called with arguments:

- `url`, an `EnhancedURL` object representing the target location.
- `redo`, a function that you can store and call at a later time that will forcibly perform the navigation, if you decide to block it.

This function should return a boolean. If you return `true`, the navigation will be blocked. Otherwise, the navigation will be performed normally.

Once the component using the `useNavigationBlock` hook is unmounted, the block will no longer be called.

The `NavigationBlock` component behaves the same way, except that the function to determine the block is passed as the `onNavigation` prop.

```tsx
import {useEffect} from 'react';
import {useNavigationBlock} from '@shopify/react-router';

function Blocker() {
  const redo = React.useRef<(() => void) | null>(null);

  useNavigationBlock((url, redoNavigation) => {
    redo.current = redoNavigation;
    return !url.pathname.startsWith('/can/always/go/here');
  });

  useEffect(() => {
    return () => {
      if (redo.current != null) {
        redo.current();
      }
    };
  }, []);

  return null;
}
```

### `<Redirect />`

The `Redirect` component is essentially a component wrapper around running `router.navigate(to, {replace: true})`. It accepts a `to` prop, which can be anything you can pass to `router.navigate`. This component also works with [`@shopify/react-network`](https://github.com/Shopify/quilt/tree/master/packages/react-network) to perform a network redirect when rendered on the server.

### `<NoMatch />`

The `NoMatch` component keeps track of whether any nested routes have been matched and, if no matches are found, renders the result of calling `renderFallback`. Note that the `Route` components do not need to be direct children; they can be nested or composed however you like.

```tsx
import React from 'react';
import {Route, NoMatch, Router} from '@shopify/react-router';

function NotFound() {
  return <div>Could not find the page you were looking for.</div>;
}

function ProductRoutes() {
  return (
    <>
      <Route path="/products" render={() => <Products />} />
      <Route path="/products/new" render={() => <CreateProduct />} />
    </>
  );
}

function OrderRoutes() {
  return (
    <>
      <Route path="/orders" render={() => <Orders />} />
      <Route path={/\/orders\/\d+/} render={() => <OrderDetails />} />
    </>
  );
}

function App() {
  return (
    <Router>
      <NoMatch renderFallback={() => <NotFound />}>
        <ProductRoutes />
        <OrderRoutes />
      </NoMatch>
    </Router>
  );
}
```

The `renderFallback` callback is called with the current `EnhancedURL` object.

This process involves some complex trickery to work on the client and server. If you render a `Router` component, it will automatically use [`@shopify/react-html`](https://github.com/Shopify/quilt/tree/master/packages/react-html) to serialize the result of matching or not on the server so that the client can hydrate properly.

### `<Prefetcher />`

The `Prefetcher` component powers the `renderPrefetch` feature discussed in the [`Route` documentation](#route). It watches for user intention to navigate, and renders the relevant "prefetches". You do not need to render this component manually when using the `Router` component, as it already renders a `Prefetcher`.

### Testing

This library provides some additional utilities geared specifically towards the need of testing. The following tools can be imported from `@shopify/react-router/testing`:

#### `TestRouter`

The `TestRouter` component mounts the necessary context providers to support the components and hooks detailed above. It accepts a single optional prop, `router`, which should be a router instance.

```tsx
// Example showing usage with react-testing
import React from 'react';
import {createMount} from '@shopify/react-testing';
import {TestRouter} from '@shopify/react-testing';

export const mount = createMount({
  // uses window.location.href as the base for a test router by default
  render: (element) => <TestRouter>{element}</TestRouter>,
});
```

> **Why take `router` instead of `url`, like the `Router` component?** In tests, you usually want the router to be the front-and-center, because tests may want to spy on its methods to ensure navigation is being performed as expected. In contrast, the router is primarily an implementation detail of application code.

#### `createTestRouter()`

The `createTestRouter` function creates a mock router that matches up the expected shape of a normal router, but that does not actually navigate when `navigate`, `go`, `back`, or `forward` are called. This function accepts an optional `url` argument, which should be a `URL` object representing the location you wish to simulate in your test. If it is not provided, a URL will be constructed that represents the value of `window.location.href`.

```tsx
import React from 'react';
import {createMount} from '@shopify/react-testing';
import {TestRouter, createTestRouter} from '@shopify/react-testing';

export const mount = createMount({
  render: (element, _, {pathname = '/test'}) => (
    <TestRouter router={createRouter(new URL(pathname))}>{element}</TestRouter>
  ),
});

// In tests...
mount(<MyComponent />, {pathname: '/my/path'});
```
