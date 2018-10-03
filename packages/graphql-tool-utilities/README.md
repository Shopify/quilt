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

### Configuration

This utility reads schema information from a [`.graphqlconfig`](https://github.com/prisma/graphql-config) file in the project root. The configuration can contain one nameless project or many named projects. The configuration is compatible with the [vscode-graphql extension](https://github.com/prisma/vscode-graphql). This extension provides syntax highlighting and autocomplete suggestions for graphql files.

Each project specifies a `schemaPath`, `include`, and `exclude` globs. Glob patterns match paths relative to the location of the configuration file. Omit `exclude` if empty.

See the [official specification documentation](https://github.com/prisma/graphql-config/blob/master/specification.md#use-cases) for more detail and examples.

#### Examples

A single nameless project configuration

```json
{
  "schemaPath": "build/schema.json",
  "includes": "app/**/*.graphql"
}
```

A multi-project configuration

```json
{
  "projects": {
    "foo": {
      "schemaPath": "build/schema/foo.json",
      "includes": "app/foo/**/*.graphql"
    },
    "bar": {
      "schemaPath": "build/schema/bar.json",
      "includes": "app/bar/**/*.graphql"
    }
  }
}
```

YAML format is also supported

```yml
schemaPath: build/schema.json
includes:
  - 'app/**/*.graphql'
```

### `graphql-tool-utilities/ast`

#### `compile(schema: GraphQLSchema, document: DocumentNode, options?: CompilerOptions): AST`

Compiles the provided schema and document into an intermediary representation using https://github.com/apollographql/apollo-cli/blob/master/packages/apollo-codegen-core/src/compiler/legacyIR.ts. This intermediate representation makes it easy to navigate through operations and their fields, without having to manually traverse the document and associate fields with the schema manually.

`AST` is our own improvement to the `LegacyCompilerContext` type definitions, but still fully backwards compatible with `LegacyCompilerContext`. See the TypeScript type definition for a detailed description of the returned `AST` type (or see [`LegacyCompilerContext`](https://github.com/apollographql/apollo-cli/blob/master/packages/apollo-codegen-core/src/compiler/legacyIR.ts) inside the [`apollo-codegen-core` module](https://github.com/apollographql/apollo-cli/tree/master/packages/apollo-codegen-core)).
