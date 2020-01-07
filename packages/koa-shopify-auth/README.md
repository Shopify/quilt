# `@shopify/koa-shopify-auth`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth)

Middleware to authenticate a [Koa](http://koajs.com/) application with [Shopify](https://www.shopify.ca/).

Sister module to [`@shopify/shopify-express`](https://www.npmjs.com/package/@shopify/shopify-express), but simplified.

Features you might know from the express module like the webhook middleware and proxy will be presented as their [own packages instead](https://github.com/Shopify/quilt/blob/master/packages/koa-shopify-graphql-proxy/README.md).

## Installation

```bash
$ yarn add @shopify/koa-shopify-auth
```

## Usage

This package exposes `shopifyAuth` by default, and `verifyRequest` as a named export.

```js
import shopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';
```

### shopifyAuth

Returns an authentication middleware taking up (by default) the routes `/auth` and `/auth/callback`.

```js
app.use(
  shopifyAuth({
    // if specified, mounts the routes off of the given path
    // eg. /shopify/auth, /shopify/auth/callback
    // defaults to ''
    prefix: '/shopify',
    // your shopify app api key
    apiKey: SHOPIFY_API_KEY,
    // your shopify app secret
    secret: SHOPIFY_SECRET,
    // scopes to request on the merchants store
    scopes: ['write_orders, write_products'],
    // set access mode, default is 'online'
    accessMode: 'offline',
    // callback for when auth is completed
    afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;

      console.log('We did it!', accessToken);

      ctx.redirect('/');
    },
  }),
);
```

#### `/auth`

This route starts the oauth process. It expects a `?shop` parameter and will error out if one is not present. To install it in a store just go to `/auth?shop=myStoreSubdomain`.

### `/auth/callback`

You should never have to manually go here. This route is purely for shopify to send data back during the oauth process.

### verifyRequest

Returns a middleware to verify requests before letting them further in the chain.

```javascript
app.use(
  verifyRequest({
    // path to redirect to if verification fails
    // defaults to '/auth'
    authRoute: '/foo/auth',
    // path to redirect to if verification fails and there is no shop on the query
    // defaults to '/auth'
    fallbackRoute: '/install',
  }),
);
```

### Example app

```javascript
import 'isomorphic-fetch';

import Koa from 'koa';
import session from 'koa-session';
import shopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';

const {SHOPIFY_API_KEY, SHOPIFY_SECRET} = process.env;

const app = new Koa();
app.keys = [SHOPIFY_SECRET];

app
  // sets up secure session data on each request
  .use(session({ secure: true, sameSite: 'none' }, app))

  // sets up shopify auth
  .use(
    shopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_SECRET,
      scopes: ['write_orders, write_products'],
      afterAuth(ctx) {
        const {shop, accessToken} = ctx.session;

        console.log('We did it!', accessToken);

        ctx.redirect('/');
      },
    }),
  )

  // everything after this point will require authentication
  .use(verifyRequest())

  // application code
  .use(ctx => {
    ctx.body = '🎉';
  });
```

## Gotchas

### Fetch

This app uses `fetch` to make requests against shopify, and expects you to have it polyfilled. The example app code above includes a call to import it.

### Session

Though you can use `shopifyAuth` without a session middleware configured, `verifyRequest` expects you to have one. If you don't want to use one and have some other solution to persist your credentials, you'll need to build your own verifiction function.

### Testing locally

By default this app requires that you use a `myshopify.com` host in the `shop` parameter. You can modify this to test against a local/staging environment via the `myShopifyDomain` option to `shopifyAuth` (e.g. `myshopify.io`).
