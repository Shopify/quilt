# `@shopify/koa-shopify-auth`

## Installation

```bash
$ yarn add @shopify/koa-shopify-auth
```

## Basic Usage

```
import Koa from 'koa';
import session from 'koa-session';
import createShopifyAuthRouter, {createVerifyRequest} from '@shopify/koa-shopify-auth';

const app = new Koa();

app.use(session(app));

const shopifyAuth = createShopifyAuthRouter({
  apiKey: 'myapikey',
  secret: 'mysecret',
  scopes: ['some', 'scopes'],
  afterAuth
});

const verifyRequest = createVerifyRequest();

app.use(shopifyAuth.routes());

app.use(verifyRequest, (ctx, next) => {
  if (ctx.path === '/some-secure-endpoint') {
    console.log('you made it :)');
  }
});
```
