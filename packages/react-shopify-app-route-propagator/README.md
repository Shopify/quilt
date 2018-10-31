# `@shopify/react-shopify-app-route-propagator`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator.svg)](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator) ![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-shopify-app-route-propagator.svg)

`<ShopifyRoutePropagator />` is a simple component to synchronize a Shopify embedded app's client side routing with the outer iframe host. It assumes the embedded app is either using [Shopify's App Bridge Library](https://help.shopify.com/en/api/embedded-apps/app-bridge) or [Polaris v3+ with Shopify App Bridge](https://polaris.shopify.com/components/structure/app-provider#section-initializing-the-shopify-app-bridge)

The component is quite small and can be used with any routing solution.

## Installation

```bash
$ yarn add @shopify/app-bridge @shopify/react-shopify-app-route-propagator
```

## Prepare app instance

Two typical way of getting an app instance are as follow:

1. Creating the app as suggested by the [app bridge documentation](https://help.shopify.com/en/api/embedded-apps/app-bridge#set-up-your-app)

```typescript
import createApp, {getShopOrigin} from '@shopify/app-bridge';
const app = createApp({
  apiKey: 'API key from Shopify Partner Dashboard',
  shopOrigin: getShopOrigin(),
});
```

2. Getting it from [polaris-react](https://github.com/Shopify/polaris-react)'s context. Note that this is only avaliable on [polaris-react](https://github.com/Shopify/polaris-react) v3 or higher.

```typescript
import React from 'react';
import * as PropTypes from 'prop-types';

class MyApp extends React.Component {
  // This line is very important! It tells React to attach the `polaris`
  // object to `this.context` within your component.
  static contextTypes = {
    polaris: PropTypes.object,
  };

  render() {
    ...
    const app = this.context.polaris.appBridge;
    const routePropagatorMarkup = app ? (
      <ShopifyRoutePropagator location={location} app={app} />
    ) : null;
  }
}
```

## Usage

The component has the following props signature

```typescript
export type LocationOrHref =
  | string
  | {search: string; hash: string; pathname: string};

export interface Props {
  app: ClientApplication<any>;
  location: LocationOrHref;
}
```

Allowing you to use it with a string

```javascript
<ShopifyRoutePropagator location="/foo/bar?thing=true" app={app} />
```

Or a location object

```javascript
<ShopifyRoutePropagator location={this.props.location} app={app} />
```

Or even with `window.location` (though then you will need to make sure it rerenders yourself)

```javascript
<ShopifyRoutePropagator location={window.location} app={app} />
```

### With React Router (withRouter)

An easy way to mount the component with minimal configuration in a [react-router](https://github.com/ReactTraining/react-router) application is to first import the `withRouter` Higher-Order-Component and create a wrapped version of the propagator.

```javascript
import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import ShopifyRoutePropagator from '@shopify/react-shopify-app-route-propagator';

export default withRouter(function(props) {
  return (
    <BrowserRouter>
      <React.Fragment>
        <ShopifyRoutePropagator location={props.location} app={app} />
        <Switch>
          <Route exact path="/">
          { /* other routes */ }
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
})
```

### With React Router (`<Route>`)

If you prefer things more explicit you can just get the `location` value to pass in explicitly by using `<Route>`'s children as a render prop.

```javascript
import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import ShopifyRoutePropagator from '@shopify/react-shopify-app-route-propagator';

export default function() {
  return (
    <BrowserRouter>
      <Route>
        {({location}) => {
          <React.Fragment>
            <ShopifyRoutePropagator location={location} app={app} />
            <Switch>
              <Route exact path="/">
              { /* other routes */ }
            </Switch>
          </React.Fragment>
        }}
      </Route>
    </BrowserRouter>
  );
}
```
