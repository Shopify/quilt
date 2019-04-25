# `@shopify/react-async`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-async.svg)](https://badge.fury.io/js/%40shopify%2Freact-async.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-async.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-async.svg)

Tools for creating powerful, asynchronously-loaded React components.

## Installation

```bash
$ yarn add @shopify/react-async
```

## Usage

### `createAsyncComponent()`

`createAsyncComponent` is a function for creating components that are loaded asynchronously on initial mount. However, the resulting component does more than just help you split up your application along component lines; it also supports customized rendering for loading, and creates additional components for smartly preloading or prefetching the component’s bundle. Best of all, in conjunction with the Babel and Webpack plugins provided by [`@shopify/async`](../async), you can easily extract the bundles needed to render your application during server side rendering.

To start, import the `createAsyncComponent` function. The simplest use of this function requires just a `load` function, which returns a promise for a component:

```tsx
import {createAsyncComponent} from '@shopify/react-async';

const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
});
```

This function returns a component that accepts the same props as the original one.

`createAsyncComponent` also adds a few static members that are themselves components: `Preload`, `Prefetch`, and `KeepFresh`.

```tsx
const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
});

// All of these are available:
<MyComponent />
<MyComponent.Prefetch />
<MyComponent.Preload />
<MyComponent.KeepFresh />
```

By default, `Preload`, `Prefetch`, and `KeepFresh` all simply prefetch the bundle for the component in the background. However, you can provide additional markup to render in these components with the `renderPreload`, `renderPrefetch`, and `renderKeepFresh` options to `createAsyncComponent`:

```tsx
const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
  renderPrefetch: () => <PrefetchSomethingElse />,
});

// Now prefetches the component, and <PrefetchSomethingElse />!
<MyComponent.Prefetch />;
```

While you can supply whatever markup you like for these, we recommend that you use them for the following purposes:

- `Preload`: loading resources that will be used by the component
- `Prefetch`: loading resources **and** data that will be used by the component
- `KeepFresh`: loading resources and data that will be used by the component, and keeping data up to date

If you want props for your `Preload`, `Prefetch`, or `KeepFresh` components, simply provide them in the `render` option for that component. The resulting components will have those prop types baked in.

```tsx
const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
  renderPreload: ({priority}: {priority: 'high' | 'low'}) => (
    <PreloadSomethingElse priority={priority} />
  ),
});

// This is a type error, we need a `priority` prop!
<MyComponent.Preload />;

// Ah, much better!
<MyComponent.Preload priority="high" />;
```

This system is designed to work well with our [`@shopify/react-graphql` package](../react-graphql). Simply create an async GraphQL query using that library, and then `Prefetch`, `Preload`, and `KeepFresh` that component alongside the React component itself:

```tsx
const MyQuery = createAsyncQueryComponent({
  load: () => import('./graphql/MyQuery.graphql'),
});

const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
  renderLoading: () => <Loading />,
  // If you use `graphql-typescript-definitions` for generating types from your
  // GraphQL documents, you'll be warned if there are required variables you aren’t
  // providing here!
  renderPrefetch: () => <MyQuery.Prefetch />,
  renderPreload: () => <MyQuery.Preload />,
  renderKeepFresh: () => <MyQuery.KeepFresh />,
});
```

#### Deferring components

By default, components are loaded as early as possible. This means that, if the library can load your component synchronously, it will try to do so. If that is not possible, it will instead load it in `componentDidMount`. In some cases, a component may not be important enough to warrant being loaded early. This library exposes a few ways of "deferring" the loading of the component to an appropriate time.

If a component should always be deferred in some way, you can pass a custom `defer` option to `createAsyncComponent`. This property should be a member of the `DeferTiming` enum, which currently allows you to force deferring the component until:

- Component mount (`DeferTiming.Mount`; this is the default)
- Browser idle (`DeferTiming.Idle`; if `window.requestIdleCallback` is not available, it will load on mount), or
- Component is in the viewport (`DeferTiming.InViewport`; if `IntersectionObserver` is not available, it will load on mount)

```tsx
import {createAsyncComponent, DeferTiming} from '@shopify/react-async';

// No deferring
const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
});

// Never load synchronously, always start load in mount
const MyComponentOnMount = createAsyncComponent({
  load: () => import('./MyComponent'),
  defer: DeferTiming.Mount,
});

// Never load synchronously, always start load in requestIdleCallback
const MyComponentOnIdle = createAsyncComponent({
  load: () => import('./MyComponent'),
  defer: DeferTiming.Idle,
});

// Never load synchronously, always start load in when any part of
// the component is intersecting the viewport
const MyComponentOnIdle = createAsyncComponent({
  load: () => import('./MyComponent'),
  defer: DeferTiming.InViewport,
});
```

#### Overwriting properties

The library always allows you to pass an `async` prop with some custom options for the underlying `<Async />` loader component (**note**: this library reserves the `async` prop name, so you can’t use that name for any of your component’s own props, or for the props you specify in the `renderPreload`, `renderPrefetch`, or `renderKeepFresh` options).

Currenty the library allows you to overwite two properties:

##### `defer?: DeferTiming`

```tsx
import {createAsyncComponent, DeferTiming} from '@shopify/react-async';

// No deferring
const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
});

// But this instance will defer until idle anyways
<MyComponent async={{defer: DeferTiming.Idle}} />;
```

This prop also works for the `Preload`, `Prefetch`, and `KeepFresh` components. Note that these components have default deferring behaviour that should work well for their intended use cases: `Preload` and `KeepFresh` defer until idle, and `Prefetch` defers until mount.

```tsx
const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
});

// Deferring until later than usual
<MyComponent.Prefetch async={{defer: DeferTiming.Idle}} />

// Don’t defer at all
<MyComponent.Preload async={{defer: undefined}} />
<MyComponent.KeepFresh async={{defer: undefined}} />
```

##### `renderLoading?(): React.ReactNode`

```tsx
import {createAsyncComponent} from '@shopify/react-async';
import {Spinner} from '@shopify/polaris';

// No loading state
const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
});

// But this instance will render <Spinner /> as its loading state
<MyComponent async={{renderLoading: () => <Spinner />}} />;
```

### `PrefetchRoute` and `Prefetcher`

The `PrefetchRoute` component allows you to use the asynchronous component you generated with `createAsyncComponent` and automatically render its `Prefetch` component when the user looks like they are going to navigate to a page that uses it. This component takes as its props the asynchronous component, a path pattern to look for (a string or `RegExp` that is compared against the target pathname), and an optional function that can map the URL to a set of props for your prefetch component.

Consider this async component:

```tsx
const ProductDetails = createAsyncComponent({
  load: () => import('./ProductDetails'),
  renderPrefetch: ({id}: {id: string}) => <PrefetchGraphQLQuery id={id} />,
});
```

This component might be rendered when the URL matches `/products/:id`. If we want to prefetch this component (including its GraphQL query!) whenever the user is going to navigate to a matching URL, we would register this intent with the following `PrefetchRoute` component:

```tsx
<PrefetchRoute
  path={/^\/products\/(\d+)$/}
  render={url => {
    const id = url.pathname.split('/').pop();
    return <ProductDetails.Prefetch id={id} />;
  }}
/>
```

To make the routes actually prefetch, you will need to add the `Prefetcher` component somewhere in your app. This component should only ever be rendered once, and will need to be somewhere that has access to all the context the prefetched components may depend on (for example, if your prefetching includes prefetching GraphQL data with Apollo, you will need to put this component below your `ApolloProvider`).

```tsx
<Prefetcher />
```

And that’s it. While we reserve the right to change it, the basic process for determining merchant navigation intent is fairly simple. We listen for users mousing over or focusing in to elements with an `href` attribute (or, `data-href`, if you can’t use a real link) and, if the user doesn’t mouse/ focus out in some small amount of time, we prefetch all matching components. We also do the prefetch when the user begins their click on an element with an `href` attribute.

### `AsyncAssetManager` and `AsyncAssetContext`

`AsyncAssetManager` and `AsyncAssetContext` allow you to extract the asynchronous bundles that were required for your application. If you use the Babel plugin, every component created by `createAsyncComponent` will report its existence when rendered to an `AsyncAssetManager`.

To make use of this feature, you will need to use [`react-effect`](../react-effect). It will automatically extract the information and clear extraneous bundles between tree traversals.

```tsx
import {extract} from '@shopify/react-effect/server';
import {AsyncAssetManager, AsyncAssetContext} from '@shopify/react-async';

const asyncAssetmanager = new AsyncAssetManager();

await extract(<App />, {
  decorate(app) {
    return (
      <AsyncAssetContext.Provider value={asyncAssetmanager}>
        {app}
      </AsyncAssetContext.Provider>
    );
  },
});

const moduleIds = [...asyncAssetmanager.used];
```

These module IDs can be looked up in the manifest created by `@shopify/async`’s Webpack plugin. If you are using [`sewing-kit-koa`](../sewing-kit-koa), you can follow the instructions from that package to automatically collect the required JavaScript and CSS bundles.

### `createAsyncContext()`

Most of the time, it makes sense to split your application along component boundaries. However, you may also have a reason to split off a part of your app that is not a component. To accomplish this, `react-async` provides a `createAsyncContext()` function. This function also takes an object with a `load` property that is a promise for the value you are splitting. The returned object mimics the shape of `React.createContext()`, except that the `Provider` component does not need a value supplied:

```tsx
const ExpensiveFileContext = createAsyncContext({
  load: () => import('./a-csv-for-some-reason.csv'),
});

// Somewhere in your app, create the provider:

<ExpensiveFileContext.Provider>
  {/* consuming code goes here */}
</ExpensiveFileContext.Provider>;

// and use the consumer to access the value:

<ExpensiveFileContext.Consumer>
  {file => (file ? <CsvViewer file={file} /> : null)}
</ExpensiveFileContext.Consumer>;
```

The typing of the render prop for the `Consumer` component always includes `null`, which is used to represent that the async value has not yet loaded successfully.
