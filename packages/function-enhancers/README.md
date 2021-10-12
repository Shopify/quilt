# `@shopify/function-enhancers`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Ffunction-enhancers.svg)](https://badge.fury.io/js/%40shopify%2Ffunction-enhancers.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/function-enhancers.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/function-enhancers.svg)

A set of helpers to enhance functions.

## Installation

```bash
$ yarn add @shopify/function-enhancers
```

## Usage

### `memoize`

The memoize decorator creates a function that memoizes the results of the function it is decorating.
The cache key for storing the results is based on the first argument provided to the memoized function.
If the memoization key cannot be inferred from the first argument alone, a `resolver` should be passed in to ensure a unique key. (ex: the unique key is in the second argument, or the unique key is a combination of a few arguments)

Know that memoization will be skipped on server process and the cached results have a maximum limit of 50 entries on a first in first out basis.

#### Memoizing a simple function

```ts
import {memoize} from '@shopify/function-enhancers';

const addOne = (number: number) => {
  return number + 1;
};

const addOneMemoized = memoize(addOne);

addOneMemoized(1); // -> 2, addOne is executed
addOneMemoized(1); // -> 2, result is from cache
```

#### Memoizing a function with object as argument

When memoizing a function with object as first argument, make sure the object is immutable.

```ts
import {memoize} from '@shopify/function-enhancers';

const getValues = (someObject: {one: string; two: string}) => {
  return;
};

const getValuesMemoized = memoize(getValues);

const testObject1 = {one: 1, two: 2};
getValuesMemoized(testObject1); // -> [1, 2], getValues is executed
getValuesMemoized(testObject1); // -> [1, 2], result is from cache

testObject1.two = 3;
getValuesMemoized(testObject1); // -> [1, 2], result is from cache, BAD
```

#### Memoizing a function while providing a resolver

The resolver takes in the same arguments as the function it is enhancing.
Be sure that the resolver returns a unique identifer.

```ts
import {memoize} from '@shopify/function-enhancers';

const getByCommand = (command: string, value: string) => {
  // implementation for getByCommand
};

const getByCommandMemoized = memoize(
  getByCommand,
  (command: string, value: string) => `${command}${value}`,
);

getByCommandMemoized('command name 1', 'command value 1'); // runCommand is executed
getByCommandMemoized('command name 1', 'command value 2'); // runCommand is executed
```

Next let's fix the example from [above](#memoizing-a-function-with-object-as-argument) so the results will always be correct.

```ts
import {memoize} from '@shopify/function-enhancers';

const getByCommand = (command: string, value: string) => {
  // implementation for getByCommand
};

const getByCommandMemoized = memoize(
  getByCommand,
  (command: string, value: string) => `${command}${value}`,
);

const testObject1 = {id: 1, value: 2};
getByCommandMemoized(testObject1); // -> [1, 2], getValues is executed
getByCommandMemoized(testObject1); // -> [1, 2], result is from cache

testObject1.value = 3;
getByCommandMemoized(testObject1); // -> [1, 3], getValues is executed
```
