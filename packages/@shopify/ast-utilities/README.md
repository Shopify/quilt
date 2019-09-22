# `@shopify/ast-utilities`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fast-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fast-utilities.svg)

Utilities for working with Abstract Syntax Trees (ASTs)

## Installation

```bash
$ yarn add @shopify/ast-utilities
```

## Usage

1. [Utilities](#utilities)
1. [Transforms](#transforms)

### Utilities

#### `transform(code, ...transforms)`

This utility applies any number of transforms onto a given block of code and returns the resulting string. See [Transforms](#transforms) examples below.

#### `astFrom(code)`

This utility provides a simple way to parse a string into an AST statement.

```tsx
import {astFrom} from '@shopify/ast-utilities';

const module = '@shopify/ast-utilities';
const util = 'compose';

const ast = astFrom`
  const {${util}} = require("${module}");
`;
```

## Transforms

#### `addComponentProps(props, componentName)`

Takes the first argument array of props and adds them to any component name that match the given second argument string.

```tsx
import {transform, addComponentProps} from '@shopify/ast-transforms';

const initial = `<Foo />`;

const result = await transform(
  initial,
  addComponentProps(
    [{name: 'someProp', value: t.identifier('someValue')}],
    'Foo',
  ),
);

console.log(result); // <Foo someProp={someValue} />
```

#### `addImportSpecifier(importSource, newSpecifier)`

Adds an import specifier, or collection of specifiers, to an existing import statement, or create a new import statement with the given specifier if it does not already exist.

```tsx
const initial = `import {foo} from './bar'`;

const result = await transform(initial, addImportSpecifier('./bar', 'baz'));

console.log(result); // import {foo, baz} from './bar',
```

#### `addImportStatement(statements)`

Adds an import statement, or collection of import statements, to a file.

```tsx
const initial = `import {foo} from './bar'`;

const result = await transform(
  initial,
  addImportStatement(`import {baz} from './qux'`),
);

// import {baz} from './qux'
// import {foo} from './bar'
console.log(result);
```

#### `replaceStrings(replacements)`

Given a set of replacements (specified as a tuple of [string, string]`), this transform will replace the first item in the tupel with the second item.

```tsx
const initial = `
  foo = 'foo';
  bar = 'bar';
`;

const result = await transform(
  initial,
  replaceStrings([['foo', 'baz'], ['bar', 'qux']]),
);

// foo = 'baz';
// bar = 'qux';
console.log(result);
```

#### `replaceJsxBody(parent, children)`

Given the parent JSX string, will find and wrap a tree of JSX, beginning with the element that maches the second argument string. This is particularly useful for add React [providers](https://reactjs.org/docs/context.html#contextprovider).

```tsx
const initial = `
  <Foo><Baz>{qux}</Baz></Foo>
`;

const result = await transform(initial, replaceJsxBody(`<Bar></Bar>`, 'Baz'));

console.log(result); // <Foo><Bar><Baz>{qux}</Baz></Bar></Foo>;
```

#### `addVariableDeclaratorProps(prop)`

Adds a new local variable destructured from `this.props`;

```tsx
const initial = `const { prop1, prop2 } = this.props;`;

const result = await transform(initial, addVariableDeclaratorProps('prop3'));

console.log(result); // const { prop1, prop2, prop3 } = this.props;
```

#### `addInterface(interface)`

Adds a new Typescript interface from the first argument string. If the interface already exists, it will be merged with the new one.

```tsx
const initial = `interface Foo {
  bar?: Baz
}
`;

const result = await transform(
  initial,
  addInterface(`interface Foo {
    qux: Quux;
  }
  `),
);

// interface Foo {
//   bar?: Baz;
//   qux: Quux;
// };
console.log(result);
```
