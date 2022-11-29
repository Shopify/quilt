# `@shopify/useful-types`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fuseful-types.svg)](https://badge.fury.io/js/%40shopify%2Fuseful-types.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/useful-types.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/useful-types.svg)

A few handy TypeScript types.

## Installation

```bash
yarn add @shopify/useful-types
```

## Usage

The following type aliases are provided by this library:

- `ThenType<T>`: When `T` is a promise, resolves to the type the promise will resolve to (`Promise<infer U>`). Otherwise, resolves to `T`. Useful when you may or may not have a promise and need to reference the underlying type.

  ```ts
  const value = 'foo';
  const promise = Promise.resolve(value);

  type V = ThenType<typeof value>; // string
  type P = ThenType<typeof promise>; // string
  ```

- `ArgumentAtIndex<T, Index>`: Resolves to the type of the argument of the passed function at the passed index. Useful for cases where you wish to extract the type of arguments without actually exporting the argument types, and is a nice complement to TypeScript’s built-in `ReturnType`.

  ```ts
  const func = (foo: Promise<any>, bar: string) => foo.then(() => bar);
  type Arg1 = ArgumentAtIndex<typeof func, 0>; // Promise<any>
  type Arg2 = ArgumentAtIndex<typeof func, 1>; // string
  type NotAnArg = ArgumentAtIndex<string, 0>; // never
  ```

- `FirstArgument<T>`: Resolves to the type of the first argument to the passed function. This is shorthand for `ArgumentAtIndex<T, 0>`.

  ```ts
  const func = (foo: Promise<any>) => foo.then(() => 'bar');
  type Arg = FirstArgument<typeof func>; // Promise<any>
  ```

- `ConstructorArgumentAtIndex<T, Index>`: Resolves to the type of the argument of the passed class's constructor at the passed index. Useful for cases where you wish to extract the type of arguments without actually exporting the argument types, and is a nice complement to TypeScript’s built-in `ReturnType`.

  ```tsx
  class SomeClass {
    constructor(floop: string, doop: number) {
      console.log(floop);
    }
  }

  type DoopType = ConstructorArgument<typeof SomeClass, 1>; // number
  ```

- `FirstConstructorArgument<T>`: Resolves to the type of the first argument to the passed class's constructor. This is shorthand for `ConstructorArgumentAtIndex<T, 0>`.

  ```ts
  class SomeClass {
    constructor(floop: string) {
      console.log(floop);
    }
  }

  type DoopType = FirstConstructorArgument<typeof SomeClass>; // string
  ```

- `ArrayElement<T>`: When `T` is an array, resolves to the type contained within the array.

  ```ts
  type FooArray = (string | number)[];
  type Foo = ArrayElement<FooArray>; // string | number
  ```

- `Omit<T, K extends keyof T>`: The opposite of TypeScript’s `Pick` type. Resolves to a new type that includes all keys in the original _except_ those matching `K`.

  ```ts
  interface Obj {
    foo: string;
    bar: boolean;
    baz: number;
  }

  type SelectiveObj = Omit<Obj, 'foo' | 'bar'>; // {baz: number}
  ```

- `DeepPartial<T>`: Recursively maps over all properties in a type and transforms them to be optional. Useful when you need to make optional all of the properties (and nested properties) of an existing type.

  ```ts
  interface Obj {
    foo: string;
    bar: {
      baz: boolean;
    };
  }

  type DeepPartialObj = DeepPartial<Obj>; // {foo?: string; bar?: { baz?: boolean }}
  ```

- `NoInfer<T>`: creates a ["lower priority inference site"](https://github.com/microsoft/TypeScript/issues/14829#issuecomment-320754731), which allows other uses of a generic to take precedence in inference.

  ```ts
  // Here, TypeScript will always use the type of the items in the `items` argument as `T`, and will not consider the type of the `item` argument of `renderItem`.
  function render<T>(items: T[], renderItem: (item: NoInfer<T>) => string) {
    /* implementation */
  }
  ```

- `DeepOmit<T, K>` Recursively maps over all properties in a type and omits those matching `K`.

```ts
interface Obj {
  __typename: string;
  foo: string;
  bar: {
    __typename: string;
    baz: string;
  };
}

type SelectiveObj = DeepOmit<Obj, '__typename'>; // {foo: string; bar: {baz: string}}
```

- `DeepOmitArray<T extends any[], K>` Iterate over all properties in an array of types and omits those matching `K`.

  ```ts
  interface Obj {
    __typename: string;
    foo: string;
  }

  type SelectiveObj = DeepOmitArray<Obj[], '__typename'>; // {foo: string}[]
  ```

- `PartialSome<T, K extends keyof T>` Make specified keys K of T optional.

  ```ts
  interface Obj {
    foo: string;
    bar: string;
  }

  type HalfPartialObj = PartialSome<Obj, 'foo'>; // {foo?: string, bar: string}
  ```

- `RequireSome<T, K extends keyof T>` Make specified keys K of T required.

  ```ts
  interface Obj {
    foo?: string;
    bar?: string;
  }

  type HalfRequiredObj = RequireSome<Obj, 'foo'>; // {foo: string, bar?: string}
  ```

- `DeepReadonly<T>`: Recursively maps over all properties in a type and transforms them to be read-only.

  ```ts
  interface Obj {
    foo: string;
    bar: {
      baz: boolean;
    };
  }

  type DeepReadonlyObj = DeepReadonly<Obj>; // {readonly foo: string; readonly bar: { readonly baz: boolean }}
  ```
