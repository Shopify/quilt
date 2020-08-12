# `@shopify/react-router`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-router.svg)](https://badge.fury.io/js/%40shopify%2Freact-router.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-router.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-router.svg)

A universal router for React, wrapping `react-router` for now.

## Installation

```bash
$ yarn add @shopify/react-router
```

## Usage

### `<Router />`

Rendering the `Router` component at the top-level of your application will create the router that is provided to the rest of the React tree. It takes a single optional prop, `location`, that represents the current location in the server-side render of the application. This is not used or required in the client-side render of your application and can be `undefined` in that environment.

This value should be derived from the server-side Node http request object. If you are rendering your app with a Node based web framework (such as [Koa](https://koajs.com/#request) or [Express](http://expressjs.com/en/5x/api.html#req)), there will be a standard convention for accessing this object within the lifecycle of each request to your server.

A typical application will have a middleware within their application chain that is responsible for rendering the React tree, and providing your main App component the `location` prop. It can then delegate this value to the `Router` on the `location` prop. We also provide a simple library, [`@shopify/react-server`](../react-server/README.md), for React server-side rendering.

```tsx
import React from 'react';
import {Router} from '@shopify/react-router';

// Assumes location will be passed in during the
// server-side render
export function App({location}: {location?: string}) {
  return <Router location={location}>{/* rest of app tree */}</Router>;
}
```

### `<Route />`

See [`react-router` docs](https://reacttraining.com/react-router/web/api/Route)

### `<Switch />`

See [`react-router` docs](https://reacttraining.com/react-router/web/api/Switch)

### `<Redirect />`

A `Redirect` component accepts a single prop, `url`, and will perform a redirect to that url when mounted.

```tsx
import React, {useState} from 'react';
import {Redirect} from '@shopify/react-router';

function MockComponent() {
  const [redirect, setRedirect] = useState();

  async function handleClick() {
    const newThing = await createThing();

    setRedirect(`/${newThing.id}`);
  }

  if (redirect) {
    return <Redirect url={redirect} />;
  }

  return <button onClick={handleClick}>Create a new thing</button>;
}
```

### `<Link />`

_TBD_

### `withRouter()`

See [`react-router` docs](https://reacttraining.com/react-router/core/api/withRouter)
