# `@shopify/decorators`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fdecorators.svg)](https://badge.fury.io/js/%40shopify%2Fdecorators.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/decorators.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/decorators.svg)

A set of decorators to aid your JavaScript journey.

## Installation

```bash
$ yarn add @shopify/decorators
```

## Usage

### `memoize`

The memoize decorator creates a function that memoizes the results of the function it is decorating.
The cache key for storing the results are based on the first argument provided to the memoized function.
If the memoization key cannot be inferred from the first argument alone, a `resolver` should be passed in to ensure a unique key. (ex: the unique key is in the second argument, or the unique key is a combination of a few arguments)

Know that memoization will be skipped on server process and the cached results have a maximum limit of 50 entries on a first in first out basis.

#### Memoizing a simple function

```ts
import {memoize} from '@shopify/decorators';

class MyClass {
  @memoize()
  addOne(number: number) {
    return number + 1;
  }
}

const myClass = new MyClass();

myClass.addOne(1); // -> 2, addOne is executed
myClass.addOne(1); // -> 2, result is from cache
```

#### Memoizing a function with object as argument

When memoizing a function with object as first argument, make sure the object is immutable.

```ts
import {memoize} from '@shopify/decorators';

class MyClass {
  @memoize()
  getValues(someObject: {one: string; two: string}) {
    return;
  }
}

const myClass = new MyClass();

const testObject1 = {one: 1, two: 2};
myClass.getValues(testObject1); // -> [1, 2], getValues is executed
myClass.getValues(testObject1); // -> [1, 2], result is from cache

testObject1.two = 3;
myClass.getValues(testObject1); // -> [1, 2], result is from cache, BAD
```

#### Memoizing a function while providing a resolver

The resolver takes in the same arguments as the function it is decorating.
Be sure that the resolver returns a unique identifer.

```ts
import {memoize} from '@shopify/decorators';

class MyClass {
  @memoize((command: string, value: string) => `${command}${value}`)
  getByCommand(command: string, value: string) {
    // implementation for getByCommand
  }
}

const myClass = new MyClass();

myClass.getByCommand('command name 1', 'command value 1'); // runCommand is executed
myClass.getByCommand('command name 1', 'command value 2'); // runCommand is executed
```

Next let's fix the example from [above](#memoizing-a-function-with-object-as-argument) so the results will always be correct.

```ts
import {memoize} from '@shopify/decorators';

class MyClass {
  @memoize((someObject: {id: string; value: string}) => `${id}${value}`)
  getValues(someObject: {id: string; value: string}) {
    return Object.values(someObject);
  }
}

const myClass = new MyClass();

const testObject1 = {id: 1, value: 2};
myClass.getValues(testObject1); // -> [1, 2], getValues is executed
myClass.getValues(testObject1); // -> [1, 2], result is from cache

testObject1.value = 3;
myClass.getValues(testObject1); // -> [1, 3], getValues is executed
```
