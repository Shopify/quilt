# `graphql-tool-utilities`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/graphql-tool-utilities.svg)](https://badge.fury.io/js/graphql-tool-utilities.svg) {{#if usedInBrowser}} [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/graphql-tool-utilities.svg)](https://img.shields.io/bundlephobia/minzip/graphql-tool-utilities.svg) {{/if}}

Common utilities for graphql-config.

## Installation

```bash
$ yarn add graphql-config-utilities
```

## Usage

### Configuration

This utility reads schema information from a [`.graphqlconfig`](https://github.com/prisma/graphql-config) file in the project root. The configuration can contain one nameless project or many named projects. The configuration is compatible with the [vscode-graphql extension](https://github.com/prisma/vscode-graphql). This extension provides syntax highlighting and autocomplete suggestions for graphql files.

Each project specifies a `schemaPath`, `include`, and `exclude` globs. Glob patterns match paths relative to the location of the configuration file. Omit `exclude` if empty.

See the [official specification documentation](https://github.com/prisma/graphql-config/blob/main/specification.md#use-cases) for more detail and examples.

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
