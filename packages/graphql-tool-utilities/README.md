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

Compiles the provided schema and document into an intermediary representation using https://github.com/apollographql/apollo-codegen/blob/master/src/compilation.js. This intermediate representation makes it easy to navigate through operations and their fields, without having to manually traverse the document and associate fields with the schema manually.

See the TypeScript type definition for a detailed description of the returned `AST` type (or see `LegacyCompilerContext` inside the `apollo-codegen-core` module).
