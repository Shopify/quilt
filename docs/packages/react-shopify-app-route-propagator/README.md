# `@shopify/react-shopify-app-route-propagator`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator.svg)](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator) ![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-shopify-app-route-propagator.svg)

This package contains both a hook, `useRoutePropagation`, and a component `<RoutePropagator />`, API. Both of these allow you to synchronize a Shopify embedded app's client side routing with the outer iframe host. It assumes the embedded app is either using [Shopify's App Bridge Library](https://help.shopify.com/en/api/embedded-apps/app-bridge) or [`@shopify/app-bridge-react`](https://github.com/Shopify/app-bridge/blob/master/packages/app-bridge-react/README.md)

The package is quite small and can be used with any routing solution.

## Installation

```bash
$ yarn add @shopify/app-bridge @shopify/react-shopify-app-route-propagator
```

## Usage

Both the hook and component versions of this library take the same two parameters:

```typescript
import {ClientApplication} from '@shopify/app-bridge';

export type LocationOrHref =
  | string
  | {search: string; hash: string; pathname: string};

export interface Props {
  app: ClientApplication<any>;
  location: LocationOrHref;
}
```

### `useRoutePropagation`

This example uses [app bridge](https://help.shopify.com/en/api/embedded-apps/app-bridge#set-up-your-app) to create an app instance and the `withRouter` enhancer from `react-router`.

```javascript
import React from 'react';
import {Switch, Route, withRouter} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import createApp, {getShopOrigin} from '@shopify/app-bridge';
import {useRoutePropagation} from '@shopify/react-shopify-app-route-propagator';

const app = createApp({
  apiKey: 'API key from Shopify Partner Dashboard',
  shopOrigin: getShopOrigin(),
});

export default withRouter(function Routes(props) {
  useRoutePropagation(
    app,
    props.location
  );

  return (
    <Switch>
      <Route exact path="/">
      { /* other routes */ }
    </Switch>
  );
})
```

### `<RoutePropagator />`

This example assume the consuming app uses both

- [`@shopify/app-bridge-react`](https://github.com/Shopify/app-bridge/blob/master/packages/app-bridge-react/README.md)
- `withRouter` enhancer from [`react-router`](https://github.com/ReactTraining/react-router)

```typescript
// App.tsx
import React from 'react';
import {BrowserRouter} from 'react-router';
import {Provider as AppBridgeProvider} from '@shopify/app-bridge-react';
import {getShopOrigin} from '@shopify/app-bridge';

import RoutePropagator from '../RoutePropagator';

export default function MyApp() {
  return (
    <BrowserRouter>
      <AppBridgeProvider
        config={{
          apiKey: 'API key from Shopify Partner Dashboard',
          shopOrigin: getShopOrigin(),
        }}
      >
        <RoutePropagator />
        <Routes />
      </AppBridgeProvider>
    </BrowserRouter>
  );
})
```

```typescript
// RoutePropagator.tsx
import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router';

import {RoutePropagator} from '@shopify/react-shopify-app-route-propagator';
import {Context as AppBridgeContext} from '@shopify/app-bridge-react';

export default withRouter(function Routes({
  location,
  server,
}: RouteComponentProps & Props) {
  const app = React.useContext(AppBridgeContext);

  return !server && app && location ? (
    <RoutePropagator location={location} app={app} />
  ) : null;
});
```
