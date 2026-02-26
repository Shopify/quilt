# `@shopify/react-html`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-html.svg)](https://badge.fury.io/js/%40shopify%2Freact-html)

A component to render your React app with no static HTML.

## Installation

```bash
$ yarn add @shopify/react-html
```

## Usage

The `<HTML>` component serves as a top level wrapper for a react application, allowing you to avoid needing any kind of server side template, in favor of purely using `reactDom.renderToString`.

```javascript
import * as React from 'react';
import {renderToString} from 'react-dom/server';

import HTML, {DOCTYPE} from '@shopify/react-html';
import MyApp from '../app';

export default (ctx, next) => {
  // we have to prepend DOCTYPE to serve valid HTML
  ctx.body = DOCTYPE + renderToString(
    <HTML>
      <MyApp />
    </HTML>
  );

  await next();
}
```

Due to [limitations in React’s implementation of HTML](https://github.com/facebook/react/issues/1035), you still need to prepend the `<!DOCTYPE html>` directive. To assist with this the module also exports a `DOCTYPE` constant.

The component will automatically propagate any usage of the `react-helmet` module in your app’s content to manipulate the title or other top level HTML or HEAD attributes.

## Interface

```typescript
export interface Props {
  children?: React.ReactNode;
  styles?: Asset[];
  scripts?: Asset[];
  blockingScripts?: Asset[];
  headData?: {[id: string]: any};
  data?: {[id: string]: any};
  hideForInitialLoad?: boolean;
}

interface Asset {
  path: string;
  integrity?: string;
}

interface Browser {
  userAgent: string;
  supported: boolean;
}
```

### Basic props

Most simple applications will only need these basic properties.

**children**
The children to be rendered inside the `#app` div.

**styles**
Descriptors for any style tags you want to include in the HEAD of the document.

**scripts**
Descriptors for any script tags you want to include in your document. All scripts passed to this property will be deferred by appending them to the end of the document. We encourage this as a default, although you may use `blockingScripts` for any scripts that must be included in the HEAD of the document.

**blockingScripts**
Descriptors for any script tags you want to include in the HEAD of the document. These will block HTML parsing until they are evaluated, so use them carefully.

**hideForInitialLoad**
Sets the body contents to be hidden for the initial render. Use this when injecting stylesheets dynamically in development in order to prevent a flash of unstyled content.

### Serializers

These props are useful for more complex applications that want to synchronize Redux, Apollo, translation, or any other data across the network boundary. These props are stringified into the DOM using (`@shopify/react-serialize`)[https://github.com/Shopify/quilt/blob/master/packages/react-serialize/README.md].

**headData**
Any serializable data that needs to be available from the DOM when the `synchronousScripts` are run.

**data**
Any serializable data that needs to be available from the DOM when the `deferredScripts` are run.

## Asset Components

This module also exports the asset components the `<HTML />` component uses internally for its script and style props.

```ts
import {Style, Script} from '@shopify/react-html';
```

### Style

The `<Style />` component lets you render `<link>` tags in your document dynamically as part of your react app.

```ts
<Style
  href="./some-style.css"
  integrity="some-integrity-hash"
  crossOrigin="anonymous"
/>
```

### Script

The `<Script />` component lets you render `<script>` tags in your document dynamically as part of your react app.

```ts
<Script
  src="./some-script.js"
  integrity="some-integrity-hash"
  crossOrigin="anonymous"
/>
```
