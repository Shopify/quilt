# `@shopify/koa-shopify-graphql-proxy`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy)

A wrapper around `koa-better-http-proxy` which allows easy proxying of GraphQL requests from an embedded Shopify app.

## Installation

```bash
$ yarn add @shopify/koa-shopify-graphql-proxy
```

## Usage

The module exports a proxy middleware as it's default export. It expects that you have other middleware set up (such as [koa-shopify-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth)) to authenticate requests with Shopify, and have session data stored on `ctx.session`.

### Basic

Attaching the middleware will proxy any requests sent to `/graphql` on your app to the current logged in shop found in session.

```javascript
// server/index.js
import koa from 'koa';
import session from 'koa-session';
import createShopifyAuth from '@shopify/koa-shopify-auth';
import proxy, {ApiVersion} from '@shopify/koa-shopify-graphql-proxy';

const app = koa();

app.use(session());

app.use(
  createShopifyAuth({
    /* your config here */
  }),
);

app.use(proxy({version: ApiVersion.Unstable}));
```

This allows client side scripts to query a logged in merchant's shop without needing to know the users access token.

```javascript
fetch('/graphql', {credentials: 'include', body: mySerializedGraphQL});
```

### Custom path

If you have your own `/graphql` route and don't want to clobber it, you can use a library like (`koa-mount`)[https://github.com/koajs/mount] to namespace the middleware.

```javascript
// server/index
import mount from 'koa-mount';

//....

app.use(mount('/shopify', proxy({version: ApiVersion.Unstable}));
```

```javascript
// client/some-component.js
fetch('/shopify/graphql', {credentials: 'include', body: mySerializedGraphQL});
```

### Private app

If you have a [private shopify app](https://help.shopify.com/en/manual/apps/private-apps), you can than skip over the auth step and use this library directly for setting up graphql proxy.

```javascript
// server/index.js
import koa from 'koa';
import session from 'koa-session';
import proxy, {ApiVersion} from '@shopify/koa-shopify-graphql-proxy';

const app = koa();

app.use(session());

app.use(
  proxy({
    version: ApiVersion.Unstable,
    shop: '<my-shop-name>.myshopify.com',
    password: '<your-app-password>',
  }),
);
```
