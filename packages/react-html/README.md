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
- `scripts`: descriptors for any script tags you want to include in your document. All scripts passed to this property will be deferred by appending them to the end of the document. We encourage this as a default, although you may use `blockingScripts` for any scripts that must be included in the HEAD of the document.
- `blockingScripts`: descriptors for any script tags you want to include in the HEAD of the document. These will block HTML parsing until they are evaluated, so use them carefully.
- `headMarkup`: additional JSX to be embedded in the head of the document (after styles, but before blocking scripts).
- `bodyMarkup`: additional JSX to be embedded in the body of the document (before serialization markup and deferred scripts).

#### `<Serialize />`

The Serialize component is a component that will take care of rendering a `script` tag with a serialized version of the `data` prop. You should not need this directly; prefer using the `createSerializer()` function within your app code instead.
