# `@shopify/ast-utilities`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fast-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fast-utilities.svg)

## ⚠ Note this package is `pre-1.0` and not ready for production use.

Utilities for working with Abstract Syntax Trees (ASTs)

## Installation

```bash
$ yarn add @shopify/ast-utilities
```

## Usage

## Utilities

### `transform(code, ...transforms)`

This utility applies any number of transforms onto a given block of code and returns the resulting string.

### `astFrom(code)`

This utility provides a simple way to parse a string into an AST statement.

```
import {fromAst} from '@shopify/ast-utilities';

const module = '@shopify/ast-utilities';
const util = 'compose';

const ast = fromAst`
  const {${util}} = require("${module}");
`;
```

## Transforms

### `addComponentProps(props: Prop[], componentName: string)`

This transform will add the given props to any components that match the given name.

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

### `addImportSpecifier()`

This transform will add an import specifier to an existing import statement, or create a new import statement with the given specifier if it does not already exist.

```tsx
const initial = `import {foo} from './bar'`;

const result = await transform(initial, addImportSpecifier('./bar', 'baz'));

console.log(result); // import {foo, baz} from './bar',
```

### `addImportStatement()`

This transform will add an import statement to a file.

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

### `replaceStrings()`

TBD

### `replaceJsxBody()`

TBD

### `addVariableDeclaratorProps()`

TBD

### `addInterface()`

TBD
