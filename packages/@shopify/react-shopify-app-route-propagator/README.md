# `@shopify/react-shopify-app-route-propagator`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator.svg)](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator) ![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-shopify-app-route-propagator.svg)

This package contains both a hook, `useRoutePropagation`, and a component `<RoutePropagator />`, API. Both of these allow you to synchronize a Shopify embedded app's client side routing with the outer iframe host. It assumes the embedded app is either using [Shopify's App Bridge Library](https://help.shopify.com/en/api/embedded-apps/app-bridge) or [Polaris v3+ with Shopify App Bridge](https://polaris.shopify.com/components/structure/app-provider#section-initializing-the-shopify-app-bridge)

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

This example uses [app bridge](https://help.shopify.com/en/api/embedded-apps/app-bridge#set-up-your-app) to create an app instance and the `withRouter` enhancer from `react-router-router`.

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

- [polaris-react](https://github.com/Shopify/polaris-react) v3 or higher
- `withRouter` enhancer from [`react-router-router`](https://github.com/ReactTraining/react-router)

```typescript
import React from 'react';
import {AppProvider} from '@shopify/polaris';
import PropTypes from 'prop-types';

export default function MyApp() {
  return (
    <BrowserRouter>
      <AppProvider
        apiKey='API key from Shopify Partner Dashboard',
        shopOrigin: getShopOrigin(),
      >
        <Routes />
      </AppProvider>
    </BrowserRouter>
  );
})
```

```typescript
import React from 'react';
import {RoutePropagator} from '@shopify/react-shopify-app-route-propagator';
import PropTypes from 'prop-types';

class Routes extends React.Component {
  // This line is very important! It tells React to attach the `polaris`
  // object to `this.context` within your component.
  static contextTypes = {
    polaris: PropTypes.object,
  };

  render() {
    const app = this.context.polaris.appBridge;
    const routePropagatorMarkup = app ? (
      <RoutePropagator location={location} app={app} />
    ) : null;


    return (
      <>
        {routePropagatorMarkup}
        <Switch>
          <Route exact path="/">
          { /* other routes */ }
        </Switch>
      </>
    );
  }
}
```
