const {graphql, buildSchema, introspectionQuery} = require('graphql');
const {resolve, dirname} = require('path');
const {readFile, writeFile} = require('fs-extra');
const glob = require('glob');

glob
  .sync(resolve(__dirname, '../packages/*/test/fixtures/**/schema.graphql'))
  .forEach((schemaFile) => {
    readFile(schemaFile, 'utf8')
      .then((schemaContents) => buildSchema(schemaContents))
      .then((schema) => graphql(schema, introspectionQuery))
      .then((results) => (
        writeFile(resolve(dirname(schemaFile), 'schema.json'), JSON.stringify(results, null, 2))
      ));
  });
