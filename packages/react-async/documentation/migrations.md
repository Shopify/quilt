# Migration guides

## 1.x to 2.x

The 2.x branch of `@shopify/react-async` is a significant update that brings progressive hydration, more flexible prefetching, the ability to preload assets in the server render, and more. These changes required some significant changes to the library.

### `renderX` options become `useX`

Flexible preloading/ prefetching/ keeping fresh depend on having those operations be implemented as hooks, rather than being implemented as components. Most examples of using using this library pre-2.x would involve rendering components to preload, like so:

```tsx
import {createAsyncComponent} from '@shopify/react-async';
import {MyComponentsQuery} from './components';

const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
  renderPreload: () => <MyComponentsQuery.Preload />,
  renderPrefetch: () => <MyComponentsQuery.Prefetch />,
  renderKeepFresh: () => <MyComponentsQuery.KeepFresh />,
});
```

This was particularly common when using `@shopify/react-graphql`, which was designed to work well in conjunction with the `renderX` methods.

In the 2.x branch, we no longer support rendering components, only using hooks. This should be a strictly more powerful technique, as it enables you to do some work up front, or delay the work into a callback that is returned. Updating will depend on exactly what was rendered through the `renderX` options. If you were only using it for tying the async component to an async query, you can use the following changes, assuming you are on the 4.x branch of `@shopify/react-graphql`:

```diff
import {
  createAsyncComponent,
+  usePreload,
+  usePrefetch,
+  useKeepFresh,
} from '@shopify/react-async';
import {MyComponentsQuery} from './components';

const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
-  renderPreload: () => <MyComponentsQuery.Preload />,
-  renderPrefetch: () => <MyComponentsQuery.Prefetch />,
-  renderKeepFresh: () => <MyComponentsQuery.KeepFresh />,
+  usePreload: () => usePreload(MyComponentsQuery),
+  usePrefetch: () => usePrefetch(MyComponentsQuery),
+  useKeepFresh: () => useKeepFresh(MyComponentsQuery),
});
```

### Async components no longer have an `async` prop

Previously, an `async` prop was allowed to customize the behavior for a single rendered component, overwriting the options passed to `createAsyncComponent`. This was almost always used to customize `renderLoading` based on some props available to the parent. Because `renderLoading` now gets called with the component props, this option was removed.

```diff
import {createAsyncComponent} from '@shopify/react-async';
import {Loading} from './components';

const MyComponent = createAsyncComponent({
  load: () => import('./MyComponent'),
-  renderLoading: () => <Loading />,
+  renderLoading: ({onClick}) => <Loading onClick={onClick} />,
});

function ConsumingComponent() {
  const onClick = () => console.log('Clicked!');

  return (
    <MyComponent
      onClick={onClick}
-      async={{renderLoading: () => <Loading onClick={onClick} />}}
    />
  );
}
```

If you were using the `async` prop for any other reason, you will need to drop down into the primitive `useAsync` instead.

### `AsyncAssetManager#used` is now a method

`AsyncAssetManager#used` was a getter in the 1.x branch of `@shopify/react-async`. In order to support distinct timing for when to load assets, this getter has been turned into a method. Affected code can simply add the call expression; `AsyncAssetManager#used` without arguments will default to returning only the assets to immediately load, which was the only kind of asset before 2.x:

```diff
import {AsyncAssetManager} from '@shopify/react-async';

async function middleware() {
  const asyncAssets = new AsyncAssetManager();

  // server code...

-  const usedAssets = asyncAssets.used;
+  const usedAssets = asyncAssets.used();
}
```

As a convenience, `used` now also returns an array, rather than a string iterable.

### `Async` is no longer available

Most code did not need to use it, but internally, async components were implemented using the `Async` component, which handled the loading and rendering of the component. In order to support hook-based preloading, this had to be removed. Anyone relying on the `Async` component should be able to adjust the usage to rely on `useAsync` instead. Note that, unlike `Async`, loading behavior is not automatically provided by `useAsync`, giving you the flexibility to define the exact behavior you are after manually.
