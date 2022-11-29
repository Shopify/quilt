# `graphql-tool-utilities`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/graphql-tool-utilities.svg)](https://badge.fury.io/js/graphql-tool-utilities.svg)

Common utilities for GraphQL developer tools.

## Installation

```bash
yarn add graphql-tool-utilities
```

## Usage

### AST

#### `compile(schema: GraphQLSchema, document: DocumentNode, options?: CompilerOptions): AST`

Compiles the provided schema and document into an intermediary representation using https://github.com/apollographql/apollo-cli/blob/main/packages/apollo-codegen-core/src/compiler/legacyIR.ts. This intermediate representation makes it easy to navigate through operations and their fields, without having to manually traverse the document and associate fields with the schema manually.

`AST` is our own improvement to the `LegacyCompilerContext` type definitions, but still fully backwards compatible with `LegacyCompilerContext`. See the TypeScript type definition for a detailed description of the returned `AST` type (or see [`LegacyCompilerContext`](https://github.com/apollographql/apollo-cli/blob/main/packages/apollo-codegen-core/src/compiler/legacyIR.ts) inside the [`apollo-codegen-core` module](https://github.com/apollographql/apollo-cli/tree/main/packages/apollo-codegen-core)).
