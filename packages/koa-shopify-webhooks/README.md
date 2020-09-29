# `@shopify/koa-shopify-webhooks`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-webhooks.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-webhooks.svg)

Register and receive webhooks from Shopify with ease. This package was created primarily for use with `@shopify/koa-shopify-auth` and friends.

## Installation

```bash
$ yarn add @shopify/koa-shopify-webhooks
```

## API

### registerWebhook

```typescript
function registerWebhook(options: {
  address: string;
  topic: Topic;
  format: string;
  accessToken: string;
  shop: string;
  apiVersion: ApiVersion;
}): {success: boolean; result: any};
```

Registers a webhook for the given `topic` which will send requests to the given `address`. Returns an object with success `true` / `false` to indicate success or failure, as well as the parsed JSON of the response from Shopify. This function will throw if the fetch request it makes encounters an error.

### receiveWebhook

```typescript
function receiveWebhook({
  secret: string;
  // only respond to requests to this path
  path?: string;
  // call this function when a valid webhook is received
  onReceived?(ctx: Context, next: () => unknown);
}): Middleware;
```

Creates a middleware that will verify whether incoming requests are legitimately from Shopify. Extracts webhook data into context or terminates the middleware chain.

## Usage

### Example app

```javascript
import 'isomorphic-fetch';

import Koa from 'koa';
import session from 'koa-session';
import shopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';
// Import our package
import {receiveWebhook, registerWebhook} from '@shopify/koa-shopify-webhooks';

const {SHOPIFY_API_KEY, SHOPIFY_SECRET} = process.env;

const app = new Koa();

app.keys = [SHOPIFY_SECRET];

app.use(session(app));
app.use(
  shopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_SECRET,
    scopes: ['write_orders, write_products'],
    async afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;

      // register a webhook for product creation
      const registration = await registerWebhook({
        // for local dev you probably want ngrok or something similar
        address: 'www.mycool-app.com/webhooks/products/create',
        topic: 'PRODUCTS_CREATE',
        accessToken,
        shop,
        ApiVersion.Unstable
      });

      if (registration.success) {
        console.log('Successfully registered webhook!');
      } else {
        console.log('Failed to register webhook', registration.result);
      }

      ctx.redirect('/');
    },
  }),
);

app.use(
  // receive webhooks
  receiveWebhook({
    path: '/webhooks/products/create',
    secret: SHOPIFY_SECRET,
    // called when a valid webhook is received
    onReceived(ctx) {
      console.log('received webhook: ', ctx.state.webhook);
    },
  }),
);

app.use(verifyRequest());

app.use(ctx => {
  /* app code */
});
```

### `koa-router` and multiple webhooks

```javascript
import 'isomorphic-fetch';

import Koa from 'koa';
import router from 'koa-router';
import session from 'koa-session';
import shopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';
// Import our package
import {receiveWebhook, registerWebhook} from '@shopify/koa-shopify-webhooks';

const {SHOPIFY_API_KEY, SHOPIFY_SECRET} = process.env;

const app = new Koa();
const router = new Router();

app.keys = [SHOPIFY_SECRET];

app.use(session(app));
app.use(
  shopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_SECRET,
    scopes: ['write_orders, write_products'],
    async afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;

      await registerWebhook({
        address: 'www.mycool-app.com/webhooks/products/create',
        topic: 'PRODUCTS_CREATE',
        accessToken,
        shop,
        ApiVersion.Unstable
      });

      await registerWebhook({
        address: 'www.mycool-app.com/webhooks/orders/create',
        topic: 'ORDERS_CREATE',
        accessToken,
        shop,
        ApiVersion.Unstable
      });

      ctx.redirect('/');
    },
  }),
);

const webhook = receiveWebhook({secret: SHOPIFY_SECRET});

router.post('/webhooks/products/create', webhook, () => {
  /* handle products create */
});
router.post('/webhooks/orders/create', webhook, () => {
  /* handle orders create */
});

router.get('*', verifyRequest(), () => {
  /* app code */
});

app.use(router.allowedMethods());
app.use(router.routes());
```

## Gotchas

Make sure to install a fetch polyfill, since internally we use it to make HTTP requests.

In your terminal
`$ yarn add isomorphic-fetch`

In your app
`import 'isomorphic-fetch'`

OR

`require('isomorphic-fetch')`
