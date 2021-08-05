# `graphql-validate-fixtures`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/graphql-validate-fixtures.svg)](https://badge.fury.io/js/graphql-validate-fixtures.svg)

Validates JSON fixtures for GraphQL responses against the associated operations and schema.

## Installation

```bash
$ yarn add graphql-validate-fixtures
```

## Usage

In order to associate a fixture with a GraphQL query or mutation in your app, you must follow one of these conventions:

- Your fixtures are in a directory with a name matching that of the associated GraphQL operation
- Your fixtures have a key called `@operation` at the top level, which has a string value that is the name of the associated operation

Once this is done, you can validate your fixtures using the CLI or Node.js API.

### Operation

On startup this tool performs the following actions:

- Loads all schemas
- Discovers all operations belonging to each schema
- Discovers all fixtures and infers operation names as described [above](#Usage)
- Validates fixtures against the operation with a matching name
  - Reports operation not found error if no schema matches
  - Reports ambiguous operation name error if more than one schema matches

### Configuration

This tool reads schema information from a [`.graphqlconfig`](https://github.com/Shopify/graphql-tools-web/tree/main/packages/graphql-tool-utilities#configuration) file in the project root.

### CLI

```sh
# Must provide a list of fixtures as the first argument
yarn run graphql-validate-fixtures 'src/**/fixtures/**/*.graphql.json'
```

### Node

```js
const {evaluateFixtures} = require('graphql-validate-fixtures');
evaluateFixtures({
  fixturePaths: ['test/fixtures/one.json', 'test/fixtures/two.json'],
}).then((results) => {
  // See the TypeScript definition file for more details on the
  // structure of the `results`
  results.forEach((result) => console.log(result));
});
```
