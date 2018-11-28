# `@shopify/react-html`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-html.svg)](https://badge.fury.io/js/%40shopify%2Freact-html)

A collection of utilities for constructing an HTML document.

## Installation

```bash
$ yarn add @shopify/react-html
```

## Usage

This package exposes two entrypoints:

- `@shopify/react-html`: which contains code that can be used on server and client. Code in your `app` and `client` directories should import from this entrypoint.
- `@shopify/react-html/server`: which contains all of `react-html`, but also includes some features that are not safe to run in a browser context. Code in your `server` directory should import from this entrypoint.

> Note: because this package creates an HTML document, this package is only for applications that are server rendered in Node. Rails apps generally have Rails perform the render of the HTML document, so they do not benefit from any part of this library.

### In your server middleware

Your server needs construct an HTML document. To do this, you can use the `Html` component and `render` function from `@shopify/react-html/server`:

```tsx
import * as React from 'react';
import {render, Html} from '@shopify/react-html/server';

import App from '../app';

export default function middleware(ctx) {
  ctx.body = render(
    <Html>
      <App />
    </Html>,
  );
}
```

The component will automatically propagate any usage of the [`react-helmet` library](https://github.com/nfl/react-helmet) in your app’s content to manipulate the title or other top level HTML or HEAD attributes. If you want to make use of the serialization techniques [documented below](#in-your-app-code), you must also construct a `Manager` instance, pass it to a `<Provider />` component, and call `@shopify/react-effect`’s `extract` method:

```tsx
// in App.tsx
import {Manager, Provider} from '@shopify/react-html';

function App({htmlManager}: {htmlManager: Manager}) {
  return <Provider manager={htmlManager}>Hello world!</Provider>;
}
```

```tsx
// Somewhere in your server
import {extract} from '@shopify/react-effect/server';
import {render, Html, Manager} from '@shopify/react-html/server';

export default function middleware(ctx) {
  const manager = new Manager();
  const app = <App htmlManager={manager} />;

  await extract(app);

  ctx.body = render(<Html manager={manager}>{app}</Html>);
}
```

You can also use the `Script`, `Style`, and `Serialize` components detailed in the [API reference](#api-reference) to manually construct a variety of tags, which you will typically insert into the document with the [`Html` component’s `headMarkup` and `bodyMarkup` props](#html).

### In your client entrypoint

Your client needs to rehydrate the React application. In development, it also needs to remove some of the temporary markup we create to prevent flashes of unstyled content. To do so, use the `showPage` function exported from `@shopify/react-html`:

```tsx
import {hydrate} from 'react-dom';
import {showPage} from '@shopify/react-html';
import App from '../app';

hydrate(<App />, document.querySelector('#app'));
showPage();
```

You do not need to create a `Manager`/ `Provider` component on the client.

### In your application code

Some parts of your application code may have some form of state that must be rehydrated when the server-rendered page is rehydrated on the client. To do so, application code can use the `createSerializer` function exported from `@shopify/react-html`.

`createSerializer()` accepts a single string argument for the identifier to use; this will help you find the serialized `script` tag if you need to debug later on. It also accepts a generic type argument for the type of the data that will be serialized/ available after deserialization.

The function returns a pair of components:

```tsx
const {Serialize, WithSerialized} = createSerializer<string>('MyData');

// Would create components with the following types:

function Serialize({data}: {data(): string}): null;
function WithSerialized({
  children,
}: {
  children(data: string | undefined): React.ReactNode;
}): React.ReactNode;
```

The general pattern for using these components is to render the `WithSerialized` component as the top-most child of a component responsible for managing this state. Within the render prop, construct whatever stateful store or manager you need, using the data that was retrieved in cases where the serialization was found (on the browser, or on subsequent server renders). Finally, render the UI that depends on that stateful part, and a `Serialize` component that extracts the part that you you need to communicate between server and client.

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
      {data => {
        const manager = new Manager(
          {locale: data ? data.locale : locale},
          data && data.translations,
        );

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

The rationale for this approach to handling serialization is available in [our original proposal](https://github.com/Shopify/web-foundation/blob/master/Proposals/02%20-%20Serialization%20in%20application%20code.md).

## API reference

### `<Html />`

The `<Html>` component serves as a top level wrapper for a React application, allowing you to avoid needing any kind of server-side template. It is only available from the server entrypoint of this package (`@shopify/react-html/server`). The `Html` component accepts the following props:

- `manager`: a `Manager` instance. When provided, the `Html` component will extract all the information from this object and place it in an appropriate place in the document.
- `children`: the application. It will be rendered to a string and placed inside a `div` with an ID of `app`.
- `locale`: the language to use for the HTML `lang` attribute.
- `styles`: descriptors for any style tags you want to include in the HEAD of the document.
- `scripts`: descriptors for any script tags you want to include in your document. All scripts passed to this property will be deferred by appending them to the end of the document. We encourage this as a default because it improves the initial rendering performance of your page.
- `blockingScripts`: descriptors for any script tags you want to include in the HEAD of the document. These will block HTML parsing until they are evaluated, so use them carefully.
- `headMarkup`: additional JSX to be embedded in the head of the document (after styles, but before blocking scripts).
- `bodyMarkup`: additional JSX to be embedded in the body of the document (before serialization markup and deferred scripts).

```tsx
import {Html} from '@shopify/react-html/server';

const html = (
  <Html
    locale="fr"
    styles={[{path: '/style.css'}]}
    scripts={[{path: '/script.js'}]}
  >
    <App />
  </Html>
);
```

### `<Style />`

The `<Style />` component lets you render `<link>` tags in your document dynamically as part of your react app. It supports all of the props of a basic `link` tag, but forces some properties to be the values needed for a stylesheet. In general, prefer the `styles` prop of the `Html` component instead of using this component explicitly.

```tsx
import {Style} from '@shopify/react-html';

<Style
  href="./some-style.css"
  integrity="some-integrity-hash"
  crossOrigin="anonymous"
/>;
```

### `<Script />`

The `<Script />` component lets you render `<script>` tags in your document dynamically as part of your react app. It supports all the props of a basic `script` tag. In general, prefer the `scripts` prop of the `Html` component instead of using this component explicitly.

```tsx
import {Script} from '@shopify/react-html';

<Script
  src="./some-script.js"
  integrity="some-integrity-hash"
  crossOrigin="anonymous"
/>;
```

### `<Serialize />`

The Serialize component takes care of rendering a `script` tag with a serialized version of the `data` prop. It is provided for incremental adoption of the `createSerializer()` method of generating serializations [documented above](#in-your-app-code).

### `render()`

The `render()` function creates a stringified version of the HTML document with an appropriate DOCTYPE. It is only available from the server entrypoint of this package (`@shopify/react-html/server`).

```tsx
import {render, Html} from '@shopify/react-html/sever';

const markup = render(<Html>Hello world!</Html>);
```

### `showPage()`

This function encapsulates the logic for showing the page in development, where it is hidden on the initial render by default. You must call this function from your client entry point, usually right after hydrating your React app. It returns a promise that resolves after the document is guaranteed to be visible.

### `getSerialized<Data>()`

To help in migration, this function can imperatively return the parsed value of a serialization. It returns the data cast to whatever is passed for `Data`. It should only be called on the client.

## Migration

- [Migrating from 4.x to 5.x](../documentation/migration-version-4-to-5.md)
