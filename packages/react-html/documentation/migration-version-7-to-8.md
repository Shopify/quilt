# Migrating from `@shopify/react-html@7.x` to `@shopify/react-html@8.x`

Version 8 of `@shopify/react-html` brings support for React hooks, and also restructures some of the exports to improve consistency with other libraries.

## Remove `<Provider />`/ `Manager`, add `<HeadUpdater />`

You no longer need to wrap your app in a `Provider` on the client-side (for server rendering, read the next section). Instead, render a `<HeadUpdater />` somewhere in the app, which will take care of updating `title`, `link`, and `meta` tags in the head when updating.

```diff
import {
-   Provider as HtmlProvider,
-   Manager as HtmlManager,
+   HeadUpdater,
} from '@shopify/react-html';

interface Props {
-   manager: HtmlManager;
}

export default function App({
-   manager
}: Props) {
  return (
-     <HtmlProvider manager={manager}>
+     <>
      <RestOfApp />
+       <HeadUpdater />
-     </HtmlProvider>
+     </>
  );
}
```

## Use `<HtmlContext />`/ `HtmlManager` on the server

When rendering in a server context, you must construct an `HtmlManager` (formerly `Manager`) instance and provide it to your React tree. To do so, you can now use the raw `<HtmlContext.Provider />` component, rather than the old `<Provider />`

### Before

```tsx
import {render, Html, Manager} from '@shopify/react-html/server';
import {Provider} from '@shopify/react-html';
import {extract} from '@shopify/react-effect/server';

export default async function middleware(ctx) {
  const app = <App />;
  const manager = new Manager();

  await extract(app, {
    // Or, sometimes, `htmlManager` was provided as a prop to `<App />`
    decorate: app => <Provider manager={manager}>{app}</Provider>,
  });

  ctx.body = render(<Html manager={manager}>{app}</Html>);
}
```

### After

```tsx
import {
  render,
  Html,
  HtmlManager,
  HtmlContext,
} from '@shopify/react-html/server';
import {extract} from '@shopify/react-effect/server';

export default async function middleware(ctx) {
  const app = <App />;
  const htmlManager = new HtmlManager();

  await extract(app, {
    decorate: app => (
      <HtmlContext.Provider manager={htmlManager}>{app}</HtmlContext.Provider>
    ),
  });

  ctx.body = render(<Html manager={htmlManager}>{app}</Html>);
}
```

## Try `useTitle`, `useFavicon`, `usePreconnect`, `useLink`, and `useMeta`

The `<Title />`, `<Favicon />`, `<Preconnect />`, `<Link />`, and `<Meta />` components now have hook versions. Give them a try for any of these components that are not conditionally rendered.

## Prefer `useSerialized()` over `<Serialize />`/ `createSerializer()`

The new `useSerialized` hook is the easiest way of doing serializations in React. You can read about this new pattern in the [README](../README.md#in-your-application-code). You should prefer this over the other APIs for serialization, which have only been left in for the following purposes:

- `<Serialize />`/ `getSerialized()`: use these in cases where the serialization **must** be part of the head of the document, or where you need to retrieve the value of a serialization outside of a React component.
- `createSerializer()`: use the components provided by this function only if the component doing the serialization must remain a class-based component.
