# `graphql-tool-utilities`

> Common utilities for `graphql-config`

## Installation

```
npm install graphql-config-utilities --save
```

or, with Yarn:

```
yarn add graphql-config-utilities
```

## Usage

### Configuration

This utility reads schema information from a [`.graphqlconfig`](https://github.com/prisma/graphql-config) file in the project root. The configuration can contain one nameless project or many named projects. The configuration is compatible with the [vscode-graphql extension](https://github.com/prisma/vscode-graphql). This extension provides syntax highlighting and autocomplete suggestions for graphql files.

Each project specifies a `schemaPath`, `include`, and `exclude` globs. Glob patterns match paths relative to the location of the configuration file. Omit `exclude` if empty.

See the [official specification documentation](https://github.com/prisma/graphql-config/blob/master/specification.md#use-cases) for more detail and examples.

#### Example: single nameless project configuration

```json
{
  "schemaPath": "build/schema.json",
  "includes": "app/**/*.graphql"
}
```

#### Example: multi-project configuration

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

#### Example: YAML format

```yml
schemaPath: build/schema.json
includes:
  - 'app/**/*.graphql'
```
