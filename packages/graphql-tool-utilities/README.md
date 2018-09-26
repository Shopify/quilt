# `graphql-tool-utilities`

> Common utilities for GraphQL developer tools

## Installation

```
npm install graphql-tool-utilities --save
```

or, with Yarn:

```
yarn add graphql-tool-utilities
```

## Usage

### `graphql-tool-utilities/ast`

#### `compile(schema: GraphQLSchema, document: DocumentNode, options?: CompilerOptions): AST`

Compiles the provided schema and document into an intermediary representation using https://github.com/apollographql/apollo-cli/blob/master/packages/apollo-codegen-core/src/compiler/legacyIR.ts. This intermediate representation makes it easy to navigate through operations and their fields, without having to manually traverse the document and associate fields with the schema manually.

`AST` is our own improvement to the `LegacyCompilerContext` type definitions, but still fully backwards compatible with `LegacyCompilerContext`. See the TypeScript type definition for a detailed description of the returned `AST` type (or see [`LegacyCompilerContext`](https://github.com/apollographql/apollo-cli/blob/master/packages/apollo-codegen-core/src/compiler/legacyIR.ts) inside the [`apollo-codegen-core` module](https://github.com/apollographql/apollo-cli/tree/master/packages/apollo-codegen-core)).
