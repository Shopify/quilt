# `@shopify/useful-types`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fuseful-types.svg)](https://badge.fury.io/js/%40shopify%2Fuseful-types.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/useful-types.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/useful-types.svg)

A few handy TypeScript types.

## Installation

```bash
$ yarn add @shopify/useful-types
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

- `Props<T>`: Extracts the prop type from a React component. This allows you to access property types without having to manually export/ import the type.

  ```tsx
  function MyComponent({name}: {name: string}) {
    return <div>Hello, {name}!</div>;
  }

  class MyOtherComponent extends React.Component<{seconds: number}> {
    render() {
      return <div>{this.props.seconds} seconds left!</div>;
    }
  }

  type MyComponentProps = Props<typeof MyComponent>; // {name: string}
  type MyOtherComponentProps = Props<typeof MyOtherComponent>; // {seconds: number}
  ```

- `DeepPartial<T>`: Recusively maps over all properties in a type and transforms them to be optional. Useful when you need to make optional all of the properties (and nested properties) of an existing type.

  ```ts
  interface Obj {
    foo: string;
    bar: {
      baz: boolean;
    };
  }

  type DeepPartialObj = DeepPartial<Obj>; // {foo?: string; bar?: { baz?: boolean }}
  ```
