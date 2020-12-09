# `@shopify/react-html`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-html.svg)](https://badge.fury.io/js/%40shopify%2Freact-html)

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

Your server needs to construct an HTML document. To do this, you can use the `Html` component and `render` function from `@shopify/react-html/server`:

```tsx
import React from 'react';
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

If you want to make use of the serialization techniques [documented below](#in-your-application-code), you must also construct an `HtmlManager` instance, pass it to a `<HtmlContext.Provider />` component, and call `@shopify/react-effect`’s `extract` method:

```tsx
// Somewhere in your server
import {extract} from '@shopify/react-effect/server';
import {
  render,
  Html,
  HtmlManager,
  HtmlContext,
} from '@shopify/react-html/server';

export default async function middleware(ctx) {
  const manager = new HtmlManager();
  const app = <App />;

  await extract(app, {
    decorate: element => (
      <HtmlContext.Provider value={manager}>{element}</HtmlContext.Provider>
    ),
  });

  ctx.body = render(<Html manager={manager}>{app}</Html>);
}
```

You can also use the `Script`, `Style`, and `Serialize` components detailed in the [API reference](#api-reference) to manually construct a variety of tags, which you will typically insert into the document with the [`Html` component’s `headMarkup` and `bodyMarkup` props](#html).

### In your application

In order for `link`, `meta`, and `title` tags to be updated as components are mounted and unmounted, you must render the `HtmlUpdater` component somewhere in your tree:

```tsx
// Somewhere in app code

function App() {
  return (
    <>
      <HtmlUpdater />
      <RestOfApp />
    </>
  );
}
```

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

Some parts of your application code may have some form of state that must be rehydrated when the server-rendered page is loaded on the client. To do so, application code can use the `useSerialized` hook exported from `@shopify/react-html`.

`useSerialized()` accepts a single string argument for the identifier to use; this will help you find the serialized `script` tag if you need to debug later on. It also accepts a generic type argument for the type of the data that will be serialized/ available after deserialization.

The hook returns an array where the first entry is the serialized data (or `undefined`, if it was not found), and the second entry is a component that accepts a `data` prop that is a function that returns the data to serialize (or a promise for that data).

> **Note:** providing a promise for the `data` prop has a catch if you are using `@shopify/react-effect` to extract the serializations in server rendering: it expects that you will only provide a promise for the serialization if it can’t be returned synchronously. If you always return a promise, `@shopify/react-effect` will assume it always needs to do another render of the tree, which will lead to an infinite loop.

Here is a complete example, using `@shopify/react-i18n`’s support for async translations as the data that needs to be serialized:

```tsx
import {useSerialized} from '@shopify/react-html';
import {I18nContext, Manager} from '@shopify/react-i18n';

interface Props {
  locale: string;
  children: React.ReactNode;
}

interface Data {
  locale: string;
  translations: ReturnType<Manager['extract']>;
}

export default function I18n({locale, children}: Props) {
  const [serialized, Serialize] = useSerialized<Data>('i18n');
  const {locale, translations} = serialized || {locale: explicitLocale};
  const manager = new Manager({locale, fallbackLocale: 'en'}, translations);

  return (
    <>
      <I18nContext.Provider value={manager}>{children}</I18nContext.Provider>
      <Serialize
        data={() => {
          const getData = () => ({
            locale: manager.details.locale,
            translations: manager.extract(),
          });

          return manager.loading ? manager.resolve().then(getData) : getData();
        }}
      />
    </>
  );
}
```

The rationale for this approach to handling serialization is available in [our original proposal](https://github.com/Shopify/web-foundations/blob/main/handbook/Proposals/02%20-%20Serialization%20in%20application%20code.md).

## API reference

### `useSerialized()`

See the example above for a full exploration of `useSerialized`’s API.

### `createSerializer()`

`createSerializer` is a legacy API that has been deprecated by `useSerialized()`. For full documentation of this API, please refer to older versions of this document. `createSerializer` will be removed in the next major version of `@shopify/react-html`.

### `<Html />`

The `<Html>` component serves as a top level wrapper for a React application, allowing you to avoid needing any kind of server-side template. It is only available from the server entrypoint of this package (`@shopify/react-html/server`). The `Html` component accepts the following props:

- `manager`: a `Manager` instance. When provided, the `Html` component will extract all the information from this object and place it in an appropriate place in the document.
- `children`: the application. It will be rendered to a string and placed inside a `div` with an ID of `app`.
- `locale`: the language to use for the HTML `lang` attribute.
- `styles`: descriptors for any stylesheet link tags you want to include in the HEAD of the document.
- `inlineStyles`: descriptors for any style tags you want to include in the HEAD of the document.
- `scripts`: descriptors for any script tags you want to include in your document. All scripts passed to this property will be deferred by appending them to the end of the document. We encourage this as a default because it improves the initial rendering performance of your page.
- `blockingScripts`: descriptors for any script tags you want to include in the HEAD of the document. These will block HTML parsing until they are evaluated, so use them carefully.
- `headMarkup`: additional JSX to be embedded in the head of the document (after stylesheets and inline styles, but before blocking scripts).
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

### `<Stylesheet />`

The `<Stylesheet />` component lets you render `<link>` tags in your document dynamically as part of your react app. It supports all of the props of a basic `link` tag, but forces some properties to be the values needed for a stylesheet. In general, prefer the `styles` prop of the `Html` component instead of using this component explicitly.

```tsx
import {Stylesheet} from '@shopify/react-html/server';

<Stylesheet
  href="./some-style.css"
  integrity="some-integrity-hash"
  crossOrigin="anonymous"
/>;
```

### `<InlineStyle />`

The `<InlineStyle />` component lets you render `<style>` tags in your document dynamically as part of your react app. It supports all of the props of a basic `style` tag, but forces some properties to be the values needed for an inline style. In general, prefer the `inlineStyles` prop of the `Html` component instead of using this component explicitly.

```tsx
import {InlineStyle} from '@shopify/react-html/server';

const css = '.foo {color: red}';
<InlineStyle>{css}</InlineStyle>;
```

### `<Script />`

The `<Script />` component lets you render `<script>` tags in your document dynamically as part of your react app. It supports all the props of a basic `script` tag. In general, prefer the `scripts` prop of the `Html` component instead of using this component explicitly.

```tsx
import {Script} from '@shopify/react-html/server';

<Script
  src="./some-script.js"
  integrity="some-integrity-hash"
  crossOrigin="anonymous"
/>;
```

### `<HtmlUpdater />`

The `<HtmlUpdater />` component is responsible for updating the head in response to `link`, `style`, `meta`, and `title` changes. It also renders a `HydrationTracker` from [`@shopify/react-hydrate`](../react-hydrate). You should only render one of these in your entire app.

### `useLink()` and `<Link />`

Renders a `<link />` tag in the head with the specified attributes. On the server, links are recorded in the `Manager` and automatically applied to the `Html` component. On the client, the `<link />` tags are updated in a deferred callback to minimize DOM manipulations.

Both the hook and component versions accept any properties you would supply to a `<link />` tag. If you are using this component to create a favicon, use the [`useFavicon()`/ `<Favicon />` component](#usefavicon-and-favicon-) instead.

### `useInlineStyle()` and `<InlineStyle />`

Renders an inline `<style />` tag in the head of the document with the specified attributes. On the server, links are recorded in the `Manager` and automatically applied to the `Html` component. On the client, the `<style />` tags are updated in a deferred callback to minimize DOM manipulations.

Both the hook and component versions accept any properties you would supply to an inline `<style />` tag.

### `useMeta()` and `<Meta />`

Renders a `<meta />` tag in the head with the specified attributes. This component uses the same approach to render these tags as detailed for the `<Link />` component above.

Both the hook and component versions accept any properties you would supply to a `<meta />` tag.

### `useTitle()` and `<Title />`

Renders a `<title />` tag in the head with the specified attributes. If multiple `<Title />` components/ `useTitle()` hooks are rendered in your app, the last one (usually, the most deeply nested) will be applied.

This component accepts a string child (and the hook accepts a single string argument), which will be used to set the title of the page.

### `useFavicon()` and `<Favicon />`

Renders a `<link />` tag with the necessary props to specify a favicon. Accepts a `source` prop that should be the image source for the favicon (the hook accepts a single string argument for the source).

### `usePreconnect()` and `<Preconnect />`

Renders a `<link />` tag that preconnects the browser to the host specified by the `source` prop. You can read more about preconnecting on [Google’s guide to resource prioritization](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect).

### `useBodyAttributes()` and `<BodyAttributes />`

Applies the provided props as props on the `body` element during server rendering. If multiple uses of this hook/ component are present in the application, they are flattened from first to last added.

### `useHtmlAttributes()` and `<HtmlAttributes />`

Applies the provided props as props on the `html` element during server rendering. If multiple uses of this hook/ component are present in the application, they are flattened from first to last added.

### `<Responsive />`

Renders a `<Meta />` tag that specifies additional functionality and dimensions to mobile devices. Accepts a `coverNotch` property which allows the viewport to fill the device display, and an `allowPinchToZoom` property to the allow the app to be zoomed-in. Both properties default to `true`.

### `<AppleHomeScreen />`

Renders iOS-specific `<Meta />` tags and `<Link />` tags to specify additional visual information on how to display the app on iOS devices. Accepts an `icons` property as an array of image attributes to be used for the app‘s home screen icon. Also accepts a `startUpImage` url to render while the app is loading after being launched from the home screen.

### `<Serialize />`

The Serialize component takes care of rendering a `script` tag with a serialized version of the `data` prop. It is provided for incremental adoption of the `useSerialized()` method of generating serializations [documented above](#in-your-application-code).

### `render()`

The `render()` function creates a stringified version of the HTML document with an appropriate DOCTYPE. It is only available from the server entrypoint of this package (`@shopify/react-html/server`).

```tsx
import {render, Html} from '@shopify/react-html/sever';

const markup = render(<Html>Hello world!</Html>);
```

### `showPage()`

This function encapsulates the logic for showing the page in development, where it is hidden on the initial render by default. This avoids flashes of unstyled content that are an unavoidable side effect of embedding CSS in JavaScript.

You must call this function from your client entry point, usually right after hydrating your React app. It returns a promise that resolves after the document is guaranteed to be visible. An example of using this function is shown in the [client entrypoint section](#in-your-client-entrypoint).

### `getSerialized<Data>()`

To help in migration, this function can imperatively return the parsed value of a serialization. It returns the data cast to whatever is passed for `Data`. It should only be called on the client.

## Migration

- [Migrating from 4.x to 5.x](./documentation/migration-version-4-to-5.md)
