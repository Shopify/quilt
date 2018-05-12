# `@shopify/react-shopify-app-route-propagator`

`<ShopifyRoutePropagator />` is a simple component to synchronize a Shopify embedded app's client side routing with the outer iframe host.

The component is quite small and can be used with any routing solution.

## Installation

```bash
$ yarn add @shopify/react-shopify-app-route-propagator
```

## Usage

The component has the following props signature

```typescript
export type LocationOrHref =
  | string
  | {search: string; hash: string; pathname: string};

export interface Props {
  location: LocationOrHref;
}
```

Allowing you to use it with a string

```javascript
<ShopifyRoutePropagator location="/foo/bar?thing=true" />
```

Or a location object

```javascript
<ShopifyRoutePropagator location={this.props.location} />
```

Or even with `window.location` (though then you will need to make sure it rerenders yourself)

```javascript
<ShopifyRoutePropagator location={window.location} />
```

### With React Router (withRouter)

An easy way to mount the component with minimal configuration in a [react-router](https://github.com/ReactTraining/react-router) application is to first import the `withRouter` Higher-Order-Component and create a wrapped version of the propagator.

```javascript
import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import ShopifyRoutePropagator from '@shopify/react-shopify-app-route-propagator';

const Propagator = withRouter(ShopifyRoutePropagator);

export default function() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Propagator />
        <Switch>
          <Route exact path="/">
          { /* other routes */ }
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
}
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
            <ShopifyRoutePropagator location={location} />
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
