/* eslint no-console: off */

import chalk from 'chalk';
import yargs from 'yargs';

import {EnumFormat, ExportFormat} from './types';

import {Builder, SchemaBuild, DocumentBuild} from '.';

const argv = yargs
  .usage('Usage: $0 [options]')
  .option('watch', {
    required: false,
    default: false,
    type: 'boolean',
    describe: 'Watch the GraphQL files for changes and re-run the generation',
  })
  .option('cwd', {
    required: false,
    default: process.cwd(),
    normalize: true,
    type: 'string',
    describe: 'Working directory to use',
  })
  .option('schema-types-path', {
    required: true,
    normalize: true,
    type: 'string',
    describe: 'The path to output concrete schema types',
  })
  .option('add-typename', {
    required: false,
    default: true,
    type: 'boolean',
    describe: 'Add a __typename field to every object type',
  })
  .option('export-format', {
    required: false,
    describe: 'The format to use for values exported from GraphQL documents',
    choices: [
      ExportFormat.Document,
      ExportFormat.DocumentWithTypedDocumentNode,
      ExportFormat.Simple,
    ],
  })
  .option('enum-format', {
    required: false,
    describe:
      'The format in which to generate case names for enum types in the schema',
    choices: [
      EnumFormat.CamelCase,
      EnumFormat.PascalCase,
      EnumFormat.SnakeCase,
      EnumFormat.ScreamingSnakeCase,
    ],
  })
  .option('custom-scalars', {
    required: false,
    default: '{}',
    type: 'string',
    describe:
      'A JSON-serialized object where the key is the name of a custom scalar, and the value is an object with the name and package from which to import the type to use for that scalar',
  })
  .help().argv;

const builder = new Builder({
  cwd: argv.cwd,
  schemaTypesPath: argv['schema-types-path'],
  addTypename: argv['add-typename'],
  enumFormat: argv['enum-format'],
  customScalars: normalizeCustomScalars(argv['custom-scalars']),
});

function normalizeCustomScalars(customScalarOption: string) {
  try {
    const result = JSON.parse(customScalarOption);
    return typeof result === 'object' ? result : undefined;
  } catch (error) {
    return undefined;
  }
}

const schemas: SchemaBuild[] = [];
const docs: DocumentBuild[] = [];

const BUILT = chalk.inverse.bold.green(' BUILT ');
const ERROR = chalk.inverse.bold.red(' ERROR ');

builder.on('start:docs', () => {
  docs.length = 0;
  console.log();
});

builder.on('start:schema', () => {
  schemas.length = 0;
  console.log();
});

builder.on('build:docs', (doc) => {
  docs.push(doc);
});

builder.on('build:schema', (schema) => {
  schemas.push(schema);
});

builder.on('end:docs', () => {
  docs
    .sort(({documentPath: documentPathA}, {documentPath: documentPathB}) =>
      documentPathA.localeCompare(documentPathB),
    )
    .forEach(({documentPath, definitionPath}) => {
      console.log(`${BUILT} ${chalk.dim(documentPath)} → ${definitionPath}`);
    });
});

builder.on('end:schema', () => {
  schemas
    .sort(({schemaPath: schemaPathA}, {schemaPath: schemaPathB}) =>
      schemaPathA.localeCompare(schemaPathB),
    )
    .forEach(({schemaPath, schemaTypesPath}) => {
      console.log(`${BUILT} ${chalk.dim(schemaPath)} → ${schemaTypesPath}`);
    });
});

builder.on('error', (error) => {
  console.log(`${ERROR} ${error.message}`);
  if (error.stack) {
    console.log(chalk.dim(error.stack));
  }
  console.log();

  if (!argv.watch) {
    process.exit(1);
  }
});

builder.run({watch: argv.watch});
