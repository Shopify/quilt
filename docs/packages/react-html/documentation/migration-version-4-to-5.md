# Migrating from `@shopify/react-html@4.x`/ `@shopify/react-serialize@1.x` to `@shopify/react-html@5.x`

The changes in this library from version 4.x to 5.x significantly changed the API. Notably, the new version takes over all the previous responsibilities of the `@shopify/react-serialize` library, and changes the API of the `HTML` component. This section summarizes the changes required to migrate.

## `<HTML />` is now `<Html />`, and is exported from `@shopify/react-html/server` instead of `@shopify/react-html`

We renamed the component from `HTML` to `Html` in order to prevent conflicts with our linting rules for pascal case components. We also moved `Html` to be a named export, rather than the default export. Finally, we exposed it through a separate `/server` entry point, which prevents server code accidentally ending up in client bundles. To migrate, update your imports and JSX references to the component.

```tsx
// before
import HTML from '@shopify/react-html/server';
const html = <HTML />;

// after
import {Html} from '@shopify/react-html/server';
const html = <Html />;
```

## `<Html />` `hideForInitialLoad` prop is gone, use `showPage()` to show the page in development

`hideForInitialLoad` was used in development to prevent a flash of unstyled contents. Because almost every project ended up doing `hideForInitialLoad={process.env.NODE_ENV === 'development'}`, we made this the default. As a result, you will need to use a bundler that can transform `process.env.NODE_ENV` for the client, and you will need to make sure to unset the hidden styling on the document. The library exposes a function you can use to do this:

```tsx
// before
// in your server middleware:
import HTML from '@shopify/react-html';
import App from '../app';

const html = (
  <HTML hideForInitialLoad={process.env.NODE_ENV === 'development'}>
    <App />
  </HTML>
);

// in your client entrypoint:
import {hydrate} from 'react-dom';
import App from '../app';

hydrate(<App />, document.querySelector('#app'));
setTimeout(() => {
  document.body.style.display = '';
}, 0);

// after
// in your server middleware:
import {Html} from '@shopify/react-html/server';
import App from '../app';

const html = (
  <Html>
    <App />
  </Html>
);

// in your client entrypoint:
import {hydrate} from 'react-dom';
import {showPage} from '@shopify/react-html';
import App from '../app';

hydrate(<App />, document.querySelector('#app'));
showPage();
```

`showPage` is a no-op in production, so you do not need to guard this behind any checks for development.

## `<Html />` `data`/ `headData` are replaced with `bodyMarkup`/ `headMarkup`

There is no longer a first-class API for passing in serialized data to `Html`. If you were previously using `data`/ `headData`, you can use the new props and the `Serialize` component manually:

```tsx
import {Html, Serialize} from '@shopify/react-html/server';

const data = {foo: 'bar'};
const headData = {baz: 'qux'};

// before
<Html data={data} headData={headData} />

// after
<Html
  headMarkup={
    Object.entries(headData).map(([id, data]) => (
      <Serialize key={id} id={id} data={data} />
    ))
  }
  bodyMarkup={
    Object.entries(data).map(([id, data]) => (
      <Serialize key={id} id={id} data={data} />
    ))
  }
/>
```

This is obviously much more work than it was previously. We recommend that, instead of using the method, you move to the patterns described in the [app code](#app-code) section of this document. The new pattern allows you to move your serializations beside the component that actually cares about them, and automatically inserts them into the HTML document.

## `<Serializer />` is now `<Serialize />` and is exported from `@shopify/react-html/server`

The `<Serializer />` component used to be imported from `@shopify/react-serialize`. It has now moved to `@shopify/react-html/server`, and has a slightly nicer name. Note that you should only need this component during migration to the new pattern of serializations living alongside your application code.

## `getSerialized()` is now exported from `@shopify/react-html`

Similarly to `Serializer`, `getSerialized()` moved into this package, and should only be used temporarily while you move your application over the the [new patterns described above](#app-code). The function no longer returns an object with a `data` key, it simply returns the `data` directly. Finally, `getSerialized()` is now also a bit more protective; it throws if no node with a matching serialization ID is found, and it can return `undefined` if it fails to parse the JSON that was serialized.

```ts
import {getSerialized} from '@shopify/react-html';

// before
// was type {data: string}
const data = getSerialized<string>('my-data');

// after
// has type string | undefined
const data = getSerialized<string>('my-data');
```
