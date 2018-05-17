# `@shopify/koa-shopify-graphql-proxy`

A wrapper around koa-better-http-proxy which allows easy proxying of graphql requests from an embedded shopify app.

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
import proxy from '@shopify/koa-shopify-graphql-proxy';

const app = koa();

app.use(session());

app.use(
  createShopifyAuth({
    /* your config here */
  }),
);

app.use(proxy());
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

app.use(mount('/shopify', proxy());
```

```javascript
// client/some-component.js
fetch('/shopify/graphql', {credentials: 'include', body: mySerializedGraphQL});
```
