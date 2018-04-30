# `@shopify/react-html`

## Installation

```bash
$ yarn add @shopify/react-html
```

## Usage

The `<HTML>` component serves as a top level wrapper for a react application, allowing you to avoid needing any kind of server side template, in favour of purely using `reactDom.renderToString`.

```javascript
import * as React from 'react';
import { renderToString } from 'react-dom/server';

import HTML from '@shopify/react-html';
import MyApp from '../app';

export default (ctx, next) => {
  ctx.body = renderToString(
    <HTML>
      <MyApp />
    </HTML>
  );

  await next();
}
```

The component will automatically propagate any usage of the `react-helmet` module in your app's content to manipulate the title or other top level HTML or HEAD attributes.

## Interface

```typescript
interface Props {
  children?: React.ReactNode;
  initialApolloData?: {[key: string]: any};
  initialReduxState?: {[key: string]: any};
  requestDetails?: {[key: string]: any};
  browser?: Browser;
  styles?: Asset[];
  translations?: TranslationDictionary;
  synchronousScripts?: Asset[];
  deferedScripts?: Asset[];
  error?: ErrorLike;
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

**synchronousScripts**
Descriptors for any script tags you want to include in the HEAD of the document.

**deferredScripts**
Descriptors for any deferred script tags you want to include at the end of the document.

### Serializers

These props are useful for more complex applications that want to synchronize redux, apollo, translation, or any other data across the network boundary. All of these props are stringified into the DOM using (`@shopify/react-serialize`)[https://github.com/Shopify/quilt/blob/master/packages/react-serialize/README.md].

**browser**
Browser data from the server.

**initialApolloData**
Initial apollo store state.

**initialReduxState**
Initial redux store state.

**translations**
Initial translation data.

**requestDetails**
Any details about the incoming node request your application wants access to on the client.

**error**
Descriptors for any error you might want to render in the client.
