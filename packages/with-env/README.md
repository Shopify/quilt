# `@shopify/with-env`

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
