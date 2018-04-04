# `@shopify/koa-shopify-auth`

A small set of abstractions to help you quickly build a [Koa](http://koajs.com/) app that authenticates with [Shopify](https://www.shopify.ca/).

## Installation

```bash
$ yarn add @shopify/koa-shopify-auth
```

## Basic Usage

```javascript
import Koa from "koa";
import session from "koa-session";
import createShopifyAuth, {
  createVerifyRequest
} from "@shopify/koa-shopify-auth";

const app = new Koa();

app.use(session(app));

app.use(createShopifyAuth({
  apiKey: "myapikey",
  secret: "mysecret",
  scope: ['write_orders, write_products'],
  afterAuth(ctx) {
    // if you have a session configured
    const { shop, accessToken } = ctx.session;
    // otherwise
    const { shop, accessToken } = ctx.state;

    // do whatever you want to persist the data here
  }
});

app.use(createVerifyRequest(), (ctx, next) => {
  if (ctx.path === "/some-secure-endpoint") {
    console.log("you made it :)");
  }
});
```
