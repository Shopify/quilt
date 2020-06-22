# `@shopify/with-env`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator.svg)](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator)

A utility for executing code under a specific `NODE_ENV`.

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

It also allows to change (and reset) multiple environment variables at once.

```ts
import withEnv from '@shopify/with-env';

it('does one thing', () => {
  withEnv({MY_ENV_ONE: 'test', ANOTHER_ENV: 'test-2'}, () => {
    // your code here
  });
});
```
