# `graphql-validate-fixtures`

> Validates JSON fixtures for GraphQL responses against the associated operations and schema

## Installation

```
npm install graphql-validate-fixtures --save-dev
```

or, with Yarn:

```
yarn add graphql-validate-fixtures --dev
```

## Usage

In order to associate a fixture with a GraphQL query or mutation in your app, you must follow one of these conventions:

* Your fixtures are in a directory with a name matching that of the associated GraphQL operation
* Your fixtures have a key called `@operation` at the top level, which has a string value that is the name of the associated operation

Once this is done, you can validate your fixtures using the CLI or Node.js API.

### CLI

```sh
# Must provide a list of fixtures as the first argument, as well
# as flags for the path to the schema (`--schema-path`) and operations
# (`--operation-paths`, can be a glob pattern)
yarn run graphql-validate-fixtures 'src/**/fixtures/**/*.graphql.json' --schema-path 'build/schema.json' --operation-paths 'src/**/*.graphql'
```

### Node

```js
const {evaluateFixtures} = require('graphql-validate-fixtures');
evaluateFixtures({
  fixturePaths: ['test/fixtures/one.json', 'test/fixtures/two.json'],
  schemaPath: 'build/schema.json',
  operationPaths: ['src/Home/Home.graphql'],
})
  .then((results) => {
    // See the TypeScript definition file for more details on the
    // structure of the `results`
    results.forEach((result) => console.log(result));
  });
```
