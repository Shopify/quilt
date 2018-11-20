# `@shopify/react-html`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-html.svg)](https://badge.fury.io/js/%40shopify%2Freact-html)

A collection of utilities for constructing an HTML document that supports serialization, assets, and various `head` tags.

## Installation

```bash
$ yarn add @shopify/react-html
```

## Usage

This PR exposes two entrypoints:

- `@shopify/react-html`: which contains code that can be used on server and client. Code in your `app` and `client` directories should import from this entrypoint.
- `@shopify/react-html/server`: which contains all of `react-html`, but also includes some features that are not safe to import on the client. Code in your `server` directory should import from this entrypoint.

### App code

The main entry point of this library is primarily concerned with giving you the ability to [serialize and deserialize information](https://github.com/Shopify/web-foundation/blob/master/Proposals/02%20-%20Serialization%20in%20application%20code.md) from within your application code. There are three parts to this: a `Manager`, which stores and looks up serializations, a `Provider`, that distributes this manager throughout the application, and a function for generating type-safe serialization/ deserialization components.

#### `Manager` and `Provider`

These pieces allow the library to maintain the state of your HTML document so that it can be reconstructed later on. On the server, you should construct a manager and pass it into a provider, as you will need it to construct your `<Html />` component later. You can completely omit these for the client; a version that works within the browser will automatically be constructed if you do not supply your manager/ provider.

```tsx
import {Manager, Provider} from '@shopify/react-html';

function App({htmlManager}: {htmlManager: Manager}) {
  return <Provider manager={htmlManager}>Hello world!</Provider>;
}

export default function middleware() {
  const manager = new Manager();
  const app = <App htmlManager={manager} />;
}
```

#### `createSerializer()`

This function creates serialize/ deserialize components. These can be used by components that manage a stateful part of the application that must be communicated from the server to the client (for example: async loaded translations, Redux, Apollo, etc).

`createSerializer()` accepts a single string argument for the identifier to use; this will help you find the serialized `script` tag if you need to debug later on. It also accepts a generic type argument for the type of the data that will be serialized/ available after deserialization.

The function returns a pair of components:

```tsx
createSerializer<string>('MyData');

// Would create the following components:

function Serialize({data}: {data(): string}): null;
function WithSerialized({
  children,
}: {
  children(data: string | undefined): React.ReactNode;
}): React.ReactNode;
```

The general pattern for using these components is to render the `WithSerialized` component as the top-most child. Within the render prop, construct whatever stateful store/ manager you need, using the data that was retrieved in cases where the serialization was found (on the browser, or on subsequent server renders). Finally, render the UI that depends on that stateful part, and a `Serialize` component that extracts the part that you you need to communicate between server and client.

Here is a complete example, using `@shopify/react-i18n`’s support for async translations as the data that needs to be serialized:

```tsx
import {createSerializer} from '@shopify/react-html';
import {Provider, Manager} from '@shopify/react-i18n';

interface Props {
  locale: string;
  children: React.ReactNode;
}

const {Serialize, WithSerialized} = createSerializer<
  ReturnType<Manager['extract']>
>('i18n');

export default function I18n({locale, children}: Props) {
  return (
    <WithSerialized>
      {translations => {
        const manager = new Manager({locale}, translations);

        return (
          <>
            <Provider manager={manager}>{children}</Provider>
            <Serialize
              data={() => ({
                locale: manager.details.locale,
                translations: manager.extract(),
              })}
            />
          </>
        );
      }}
    </WithSerialized>
  );
}
```

#### Utility functions

##### `showPage()`

This function encapsulates the logic for showing the page in development, where it is hidden on the initial render by default. You must call this function from your client entry point, usually right after hydrating your React app. It returns a promise that resolves after the document is guaranteed to be visible.

```tsx
import {hydrate} from 'react-dom';
import {showPage} from '@shopify/react-html';
import App from '../app';

hydrate(<App />, document.querySelector('#app'));
showPage();
```

##### `getSerialized<Data>()`

To help in migration, this function can imperatively return the parsed value of a serialization. It returns the data cast to whatever is passed for `Data`. It should only be called on the client.

#### Asset components

The main entrypoint also exposes components for easily building links to your assets:

##### `<Style />`

The `<Style />` component lets you render `<link>` tags in your document dynamically as part of your react app. It supports all of the props of a basic `link` tag, but forces some properties to be the values needed for a stylesheet.

```tsx
import {Style} from '@shopify/react-html';

<Style
  href="./some-style.css"
  integrity="some-integrity-hash"
  crossOrigin="anonymous"
/>;
```

##### `<Script />`

The `<Script />` component lets you render `<script>` tags in your document dynamically as part of your react app. It supports all the props of a basic `script` tag.

```tsx
import {Script} from '@shopify/react-html';

<Script
  src="./some-script.js"
  integrity="some-integrity-hash"
  crossOrigin="anonymous"
/>;
```

### Server

The server entrypoint allows you to easily construct an HTML document for the response. It also re-exports all of the components noted above.

#### `<Html />` and `render()`

The `<Html>` component serves as a top level wrapper for a React application, allowing you to avoid needing any kind of server-side template. The `render()` function creates a stringified version of the HTML document with an appropriate DOCTYPE.

```tsx
import * as React from 'react';
import {render, Html} from '@shopify/react-html/server';

import App from '../app';

export default function middleware(ctx, next) {
  ctx.body = render(
    <Html>
      <App />
    </Html>,
  );

  await next();
}
```

The component will automatically propagate any usage of the [`react-helmet` library](https://github.com/nfl/react-helmet) in your app’s content to manipulate the title or other top level HTML or HEAD attributes.

##### Props

The `<Html />` component accepts the following props:

- `manager`: a `Manager` instance. When provided, the `Html` component will extract all the information from this object and place it in an appropriate place in the document.
- `children`: the application. It will be rendered to a string and placed inside a `div` with an ID of `app`.
- `locale`: the language to use for the HTML `lang` attribute.
- `styles`: descriptors for any style tags you want to include in the HEAD of the document.
- `scripts`: descriptors for any script tags you want to include in your document. All scripts passed to this property will be deferred by appending them to the end of the document. We encourage this as a default because it improves the initial rendering performance of your page.
- `blockingScripts`: descriptors for any script tags you want to include in the HEAD of the document. These will block HTML parsing until they are evaluated, so use them carefully.
- `headMarkup`: additional JSX to be embedded in the head of the document (after styles, but before blocking scripts).
- `bodyMarkup`: additional JSX to be embedded in the body of the document (before serialization markup and deferred scripts).

#### `<Serialize />`

The Serialize component is a component that will take care of rendering a `script` tag with a serialized version of the `data` prop. You should not need this directly; prefer using the `createSerializer()` function within your app code instead.

## Migrating from `@shopify/react-html@4.x`/ `@shopify/react-serialize@1.x` to `@shopify/react-html@5.x`

The changes in this library from version 4.x to 5.x significantly changed the API. Notably, the new version takes over all the previous responsibilities of the `@shopify/react-serialize` library, and changes the API of the `HTML` component. This section summarizes the changes required to migrate.

### `<HTML />` is now `<Html />`, and exported from `/server` instead of the root package

We renamed the component from `HTML` to `Html` in order to prevent conflicts with our linting rules for pascal case components. We also moved `Html` to be a named export, rather than the default export. Finally, we exposed it through a separate `/server` entry point, which prevents server code accidentally ending up in client bundles. To migrate, update your imports and JSX references to the component.

```tsx
// before
import HTML from '@shopify/react-html/server';
const html = <HTML />;

// after
import {Html} from '@shopify/react-html/server';
const html = <Html />;
```

### `<Html />` `hideForInitialLoad` prop is gone, use `showPage()` to show the page in development

`hideForInitialLoad` was used in development to prevent a flash of unstyled contents. Because almost every project ended up doing `hideForInitialLoad={process.env.NODE_ENV === 'development'}`, we made this the default. As a result, you will need to use a bundler that can transform `process.env.NODE_ENV` for the client, and you will need to make sure to unset the hidden styling on the document. The library exposes a function you can use to do this:

```tsx
import {hydrate} from 'react-dom';
import {showPage} from '@shopify/react-html';
import App from '../app';

hydrate(<App />, document.querySelector('#app'));
showPage();
```

`showPage` is a no-op in production, so you do not need to guard this behind any checks for development.

### `<Html />` `data`/ `headData` are replaced with `bodyMarkup`/ `headMarkup`

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

### `<Serializer />` is now `<Serialize />` and is exported from `@shopify/react-html/server`

The `<Serializer />` component used to be imported from `@shopify/react-serialize`. It has now moved to `@shopify/react-html/server`, and has a slightly nicer name. Note that you should only need this component during migration to the new pattern of serializations living alongside your application code.

### `getSerialized()` is now exported from `@shopify/react-html`

Similarly to `Serializer`, `getSerialized()` moved into this package, and should only be used temporarily while you move your application over the the [new patterns described above](#app-code). The function no longer returns an object with a `data` key, it simply returns the `data` directly. Finally, `getSerialized()` is now also a bit more protective; it throws if no node with a matching serialization ID is found, and it can return `undefined` if it fails to parse the JSON that was serialized.

```ts
import {getSerialized} from '@shopify/react-html';

// before
// was type {data: string}
const data = getSerialized<string>('my-data');

// after
// has type string | undefined
const data = getSerialized<string>('my-data);
```
