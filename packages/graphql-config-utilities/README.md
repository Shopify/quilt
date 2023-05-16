# `graphql-tool-utilities`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/graphql-tool-utilities.svg)](https://badge.fury.io/js/graphql-tool-utilities.svg)

Common utilities for graphql-config.

## Installation

```bash
yarn add graphql-config-utilities
```

## Usage

### Configuration

This utility reads schema information from a [`graphql-config` config file](https://the-guild.dev/graphql/config/docs/user/usage) in the project root. The configuration can contain one nameless project or many named projects. The configuration is compatible with the [vscode-graphql extension](https://github.com/prisma/vscode-graphql). This extension provides syntax highlighting and autocomplete suggestions for graphql files.

Each project specifies a `schema`, `include`, and `exclude` globs. Glob patterns match paths relative to the location of the configuration file. Omit `exclude` if empty.

See the [official specification documentation](https://the-guild.dev/graphql/config/docs/user/usage) for more detail and examples.

#### Example: single nameless project configuration

```json
{
  "schema": "build/schema/schema.json",
  "include": "app/**/*.graphql"
}
```

#### Example: multi-project configuration

```json
{
  "projects": {
    "foo": {
      "schema": "build/schema/foo.json",
      "include": "app/foo/**/*.graphql"
    },
    "bar": {
      "schema": "build/schema/bar.json",
      "include": "app/bar/**/*.graphql"
    }
  }
}
```
