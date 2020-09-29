# `@shopify/koa-liveness-ping`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-liveness-ping.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-liveness-ping)

A package for creating liveness ping middleware for use with Koa.

A liveness ping is a URL at which your application will respond with a `200` whenever your server is running. It can be used, for example, for liveness checks in Kubernetes deployments.

## Installation

```bash
$ yarn add @shopify/koa-liveness-ping
```

## Usage

```typescript
import Koa from 'koa';
import ping from '@shopify/koa-liveness-ping';

const app = new Koa();

// set up any error or loggin middlewares

app.use(ping());

// other routing middlewares should go after the liveness ping
```

This middleware can also be mounted at any path via `koa-mount` ([Learn more](https://github.com/koajs/mount#mounting-middleware)).

**Note:** Mount the liveness ping middleware before all other routing-related middleware in order to ensure it can respond quickly and reliably.
