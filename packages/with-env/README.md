# `@shopify/with-env`

[![CircleCI](https://circleci.com/gh/Shopify/quilt.svg?style=svg&circle-token=8dafbec2d33dcb489dfce1e82ed37c271b26aeba)](https://circleci.com/gh/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator.svg)](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator)

A utility for executing code under a specific NODE_ENV.

## Installation

```bash
$ yarn add @shopify/with-env
```

Or, if you just need this for `test`s:

```bash
$ yarn add --dev @shopify/with-env
```

## Example Usage

In this example, we are testing some code using `Jest`. Note that, while `Jest` is not required to use `@shopify/with-env`, it is our recommended testing framework for node and javascript applications.

```ts
import withEnv from '@shopify/with-env';

it('does one thing in development', () => {
  withEnv('development', () => {
    // your code here
  });
});

it('does another thing in production', () => {
  withEnv('production', () => {
    // your code here
  });
});
```
