# GraphQL Tools

A loosely related set of packages for web projects using GraphQL and TypeScript. This libraries make use of the strongly typed nature of GraphQL to improve developer experience and compile-time confidence.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

[![CircleCI](https://circleci.com/gh/Shopify/graphql-tools-web.svg?style=svg&circle-token=8dafbec2d33dcb489dfce1e82ed37c271b26aeba)](https://circleci.com/gh/Shopify/graphql-tools-web)

## Configuration

This tool consumes a [(Prisma) `.graphqlconfig`](https://github.com/prisma/graphql-config) file, typically placed in the root of the project. This configuration file is compatible with the [VSCode extension](https://github.com/prisma/vscode-graphql) to provide syntax highlighting and autocomplete suggestions. The configuration file supports a single nameless project or multiple named projects, each project is linked to a schema and a set of include and exclude globbing patterns. Upon processing a schema file, the schema's types will be extracted to `types.ts` or `${projectName}-types.ts` and written to the `schema-types-path` (or use the `schemaTypesPath` extension as an override). The `schemaPath` can be supplied in the configuration as a `.json` or a `.graphql` file, include and exclude globbing patterns should be supplied as _relative_ paths, relative to the location of the `.graphqlconfig`.

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

A project configuration with a `schemaTypesPath` override

```json
{
  "projects": {
    "foo": {
      "schemaPath": "build/schema/foo.json",
      "includes": "app/foo/**/*.graphql"
    },
    "bar": {
      "schemaPath": "build/schema/bar.json",
      "includes": "app/bar/**/*.graphql",
      "extensions": {
        "schemaTypesPath": "app/bar/types/graphql.ts"
      }
    }
  }
}
```

## CLI

The command line interface can be run to manually process a configuration file.

#### Options

* `--schema-types-path`: specifies where to write schema types (**REQUIRED**)
* `--watch`: watches the include globbing patterns for changes and re-processes files (default = `false`)
* `--cwd`: run tool for `.graphqlconfig` located in this directory (default = `process.cwd()`)
* `--add-typename`: adds a `__typename` field to every object type (default = `true`)
* `--enum-format`: specifies output format for enum types (default = `undefined`)
  * Options: `camel-case`, `pascal-case`, `snake-case`, `screaming-snake-case`
  * `undefined` results in using the unchanged name from the schema (verbatim)

#### Examples

```sh
# run tool for .graphqlconfig in current directory, produces ./types/types.ts
graphql-typescript-definitions --schema-types-path types

# run watcher for .graphqlconfig in current directory, produces ./types/types.ts
graphql-typescript-definitions --schema-types-path types --watch

# run tool for .graphqlconfig in a child directory, produces ./src/types/types.ts
graphql-typescript-definitions --cwd src --schema-types-path types
```

## Contribute

Check out our [Contributing Guidelines](CONTRIBUTING.md). This repository uses [lerna](https://github.com/lerna/lerna) to manage it's packages as a 'monorepo' (a repository containing many packages).

## License

MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

<a href="http://www.shopify.com/"><img src="https://cdn.shopify.com/assets2/press/brand/shopify-logo-main-small-f029fcaf14649a054509f6790ce2ce94d1f1c037b4015b4f106c5a67ab033f5b.png" alt="Shopify" width="200" /></a>
