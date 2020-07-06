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

`createAsyncComponent` is a function for creating components that are loaded asynchronously on initial mount. However, the resulting component does more than just help you split up your application along component lines; it also supports customized rendering for loading and errors, and creates additional hooks and components for smartly preloading the component and its dependencies. Best of all, in conjunction with the Babel and Webpack plugins provided by [`@shopify/async`](../async), you can easily extract the bundles needed to render your application during server side rendering.

To start, import the `createAsyncComponent` function. The simplest use of this function requires just a `load` function, which returns a promise for a component:

```tsx
import {createAsyncComponent} from '@shopify/react-async';

const MyComponent = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
});
```

This function returns a component that accepts the same props as the original one.

#### Preload, prefetch, and keep fresh

`createAsyncComponent` also adds a few static members that are themselves components: `Preload`, `Prefetch`, and `KeepFresh`. Likewise, it provides a set of hooks, which allow for more complex preloading use-cases.

```tsx
const MyComponent = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
});

// All of these are available:
<MyComponent />

<MyComponent.Preload />
<MyComponent.Prefetch />
<MyComponent.KeepFresh />

MyComponent.usePreload();
MyComponent.usePrefetch();
MyComponent.useKeepFresh();
```

By default, all of these special hooks and components will preload the assets for the asynchronously-imported components. However, you can provide additional logic to perform with the `usePreload`, `usePrefetch`, and `useKeepFresh` options to `createAsyncComponent`:

```tsx
const MyComponent = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
  usePrefetch: () => {
    const networkCache = useContext(MyNetworkCache);
    return () => networkCache.preload('/component/data/endpoint');
  },
});

// Now prefetches the component assets, and performs the custom prefetch
<MyComponent.Prefetch />;

// Returns a function that will do all of the above, but allows you to run
// it at a specific time
const prefetch = MyComponent.usePrefetch();
```

While you can supply whatever logic you like for these, we recommend that you use them for the following purposes:

- `Preload`: loading resources that will be used by the component
- `Prefetch`: loading resources **and** data that will be used by the component
- `KeepFresh`: loading resources and data that will be used by the component, and keeping data up to date

If you want arguments for your `usePreload`, `usePrefetch`, or `useKeepFresh` hooks, simply specify them in the matching option for that component. These options must be some object type, and will then be used as expected arguments to the hook, and expected props for the component.

```tsx
const MyComponent = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
  usePrefetch: ({id}: {id: string}) => (
    const networkCache = useContext(MyNetworkCache);
    return () => networkCache.preload(`/data/for/${id}`);
  ),
});

// This is a type error, we need an `id` option/ prop!
<MyComponent.Prefetch />;
MyComponent.usePrefetch();

// Much better!
<MyComponent.Prefetch id="123" />;
MyComponent.usePrefetch({id: '123'});
```

This system is designed to work well with our [`@shopify/react-graphql` package](../react-graphql). Simply create an async GraphQL query using that library, and then `usePrefetch`, `usePreload`, and `useKeepFresh` that component alongside the React component itself:

```tsx
import {
  createAsyncComponent,
  // `usePreload`, `usePrefetch`, and `useKeepFresh` are convenience hooks
  // that will just call `AsyncComponentType.useX`.
  usePreload,
  usePrefetch,
  useKeepFresh,
} from '@shopify/react-async';
import {createAsyncQueryComponent} from '@shopify/react-graphql';

const MyQuery = createAsyncQueryComponent({
  load: () =>
    import(/* webpackChunkName: 'MyQuery' */ './graphql/MyQuery.graphql'),
});

const MyComponent = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
  renderLoading: () => <Loading />,
  // If you use `graphql-typescript-definitions` for generating types from your
  // GraphQL documents, you'll be warned if there are required variables you aren’t
  // providing here!
  usePreload: () => usePreload(MyQuery),
  usePrefetch: () => usePrefetch(MyQuery),
  useKeepFresh: () => useKeepFresh(MyQuery),
});
```

#### Deferring components

By default, components are loaded as early as possible. This means that, if the library can load your component synchronously, it will try to do so. If that is not possible, it will instead load it in after the component is mounted. In some cases, a component may not be important enough to warrant being loaded early. This library exposes a few ways of "deferring" the loading of the component to an appropriate time.

If a component should always be deferred in some way, you can pass a custom `defer` option to `createAsyncComponent`. This property should be a member of the `DeferTiming` enum, which currently allows you to force deferring the component until:

- Component mount (`DeferTiming.Mount`; note that this will defer it until mount even if the component could have been resolved synchronously),
- Browser idle (`DeferTiming.Idle`; if `window.requestIdleCallback` is not available, it will load on mount), or
- Component is in the viewport (`DeferTiming.InViewport`; if `IntersectionObserver` is not available, it will load on mount)

```tsx
import {createAsyncComponent, DeferTiming} from '@shopify/react-async';

// No deferring
const MyComponent = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
});

// Never load synchronously, always start load in mount
const MyComponentOnMount = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
  defer: DeferTiming.Mount,
});

// Never load synchronously, always start load in requestIdleCallback
const MyComponentOnIdle = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
  defer: DeferTiming.Idle,
});

// Never load synchronously, always start load in when any part of
// the component is intersecting the viewport
const MyComponentOnIdle = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
  defer: DeferTiming.InViewport,
});
```

You can also pass a function to `defer`. This function, which will be called with the current props of the component, should return `true` when the component should begin loading. This makes it easy to implement components that have their visibility controlled by a property, like the Polaris Modal’s `open` prop:

```tsx
const MyModalComponent = createAsyncComponent({
  load: () =>
    import(/* webpackChunkName: 'MyModalComponent' */ './MyModalComponent'),
  defer: ({open}) => open,
});
```

#### When to use MyComponent.Preload, MyComponent.Prefetch and MyComponent.KeepFresh

```tsx
<MyComponent.Preload />
```

Will only be required when you purposely want to control the pre-loading.

_For example_

```tsx
const MyComponent = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
  usePreload: () => usePreload(MyQuery),
});

<MyComponent.Preload />;
```

When relying on the default behaviour we do not need to render `MyComponent.Preload`

_For example_

```tsx
const MyComponent = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'MyComponent' */ './MyComponent'),
});

<MyComponent />;
```

#### Dont use .Preload .Prefetch components with defer
It is not advisable to use .Preload or .Prefetch with the defer property. This is because it will be ignored by
the `<MyComponent.Preload />` and `<MyComponent.Prefetch />` components.

#### Progressive hydration

It can sometimes be useful to server render a component, but to wait to load its assets until later in the page lifecycle. This is particularly relevant for large, mostly static components, components that are very likely to be outside the viewport on load, and expensive components that would cause significant layout shifts if only rendered on the client. This library supports this pattern through the `deferHydration` option, and with the help from the [`@shopify/react-hydrate` package](../react-hydrate).

> **Note:** for progressive hydration to work, you **must** render either a `HydrationTracker` component from `@shopify/react-hydrate` or an `HtmlUpdater` from `@shopify/react-html>=9.0.0` somewhere in your app.

In defining your async component, simply set the `deferHydration` option to one of the `DeferTiming` enum values (or, as noted in the previous example, a function that accepts props and returns a boolean).

```tsx
const Expensive = createAsyncComponent({
  load: () => import('./Expensive'),
  deferHydration: DeferTiming.InViewport,
});
```

The resulting component has special loading behavior that differs by environment:

- On the server, the component renders synchronously, but **does not** mark assets as used.
- On the client, when the app is undergoing hydration, the component persists its server-rendered markup, even though its assets are not yet available. When the condition specified by `deferHydration` is met, the assets will be loaded, and the component will be hydrated.
- On the client, when the app has already undergone hydration, the component will begin loading on mount, and will show the result of calling `renderLoading`, just like any other async component.

### `usePreload`, `usePrefetch`, and `useKeepFresh`

These hooks are provided as conveniences for extracting functions from an async component that can be used to preload, prefetch, or keep fresh. The result is identical to calling `AsyncComponent.useX` directly, but works better with the tooling around hooks, which often does not understand the "static member as hook" pattern.

```tsx
import {createAsyncComponent, usePreload} from '@shopify/react-async`

const Expensive = createAsyncComponent({
  load: () => import('./Expensive'),
  deferHydration: DeferTiming.InViewport,
});

function MyComponent({children}) {
  const preload = usePreload(Expensive);
  return <div onMouseEnter={preload}>{children}</div>;
}
```

### `useAsync`

The `useAsync` hook is a primitive that can be used by other libraries to create asynchronous components with different behaviors. One example is [`@shopify/react-graphql`](../react-graphql), where this hook is used to implement asynchronous GraphQL query components.

This hook accepts two arguments:

- `resolver`, an object matching the `Resolver` type from `@shopify/async`. This object is in charge of managing the loading of an asynchronous resource. It also controls the type of the result returned from the `useAsync` hook. The easiest way to construct one is to use the `createResolver` function from `@shopify/async`.
- `options`, an optional object with any of the following properties:
  - `assetTiming`: when the assets for this async asset will be used. Should be a member of the `AssetTiming` enum. This is used to register the asset as used, as documented [below](#useAsyncAsset). Defaults to `AssetTiming.Immediate`
  - `immediate`: whether the hook should attempt to resolve the async asset synchronously (using `resolver.resolved`). Defaults to `true` if `assetTiming` is `Immediate`, and `false` otherwise.

The `useAsync` hook returns an object containing details about the asynchronous asset. This object includes the following properties:

- `id`: the ID of the asset, as specified by `resolver.id`.
- `resolved`: `null` if the asset has not resolved, or had an error during resolution, and otherwise will be the unwrapped promise value returned by `resolver.resolve()`.
- `loading`: whether the asset has been loaded yet.
- `error`: an `Error` object, if calling `resolver.resolve()` rejected.
- `load`: a function that can be called to begin the loading process.

The following example demonstrates how to use the `useAsync` hook to implement the default `usePreload` provided to async components:

```tsx
import {createResolver} from '@shopify/async';
import {useAsync, AssetTiming} from '@shopify/react-async';

const resolver = createResolver({
  id: () => require.resolveWeak('./MyComponent'),
  load: () => import('./MyComponent'),
});

function usePreload() {
  return useAsync(resolver, {
    assetTiming: AssetTiming.NextPage,
  }).load;
}
```

### `PrefetchRoute` and `Prefetcher`

The `PrefetchRoute` component allows you to use the asynchronous component you generated with `createAsyncComponent` and automatically render its `Prefetch` component when the user looks like they are going to navigate to a page that uses it. This component takes as its props the asynchronous component, a path pattern to look for (a string or `RegExp` that is compared against the target pathname), and an optional function that can map the URL to a set of props for your prefetch component.

Consider this async component:

```tsx
const ProductDetails = createAsyncComponent({
  load: () => import('./ProductDetails'),
  usePrefetch: ({id}: {id: string}) =>
    usePrefetch(PrefetchableGraphQLQuery, {id}),
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

To extract the used assets, you can call `AsyncAssetManager#used()`. This method accepts an `AssetTiming`, or an array of `AssetTiming`s, which specify which assets were actually used.

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

const assetSelectors = [...asyncAssetmanager.used(AssetTiming.Immediate)];
```

These asset selectors indicate an `id` for the asset, and whether scripts and/ or styles should be included for the passed asset timings. The IDs can be looked up in the manifest created by `@shopify/async`’s Webpack plugin. If you are using [`sewing-kit-koa`](../sewing-kit-koa), you can follow the instructions from that package to automatically collect the required JavaScript and CSS bundles.

#### `useAsyncAsset()`

Other libraries may need to register an async asset as being used. They can do so with the `useAsyncAsset` hook, which accepts an optional string ID, and an optional object containing `styles` and `scripts` fields with `AssetTiming` values.

The `AssetTiming` enum values allow you to specify how high-priority an asset is, which can be used to determine how to load that asset on the initial render:

- `AssetTiming.Immediate`: load the asset as early as possible, but definitely before the initial hydration of the React application.
- `AssetTiming.CurrentPage`: the asset is not needed before hydration, but is very likely to be used for other content on the current page (used for deferred and progressively hydrated components).
- `AssetTiming.NextPage`: the asset is not needed for the current page, but may be needed after navigation (used for preloading, prefetching, and keeping fresh).

> **Note:** `useAsync` calls `useAsyncAsset` under the hood, so you likely do not need to call it directly.

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
