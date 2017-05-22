import * as yargs from 'yargs';
import * as chalk from 'chalk';

import {Builder} from '.';

const argv = yargs
  .usage('Usage: $0 <graphql-files> [options]')
  .option('schema-path', {
    required: true,
    normalize: true,
    type: 'string',
    describe: 'The path to the JSON file containing a schema instrospection query result',
  })
  .option('watch', {
    required: false,
    default: false,
    type: 'boolean',
    describe: 'Watch the GraphQL files for changes and re-run the generation',
  })
  .help()
  .argv;

const builder = new Builder({
  graphQLFiles: argv._[0],
  schemaPath: argv.schemaPath,
});

const BUILT = chalk.inverse.bold.green(' BUILT ');
const ERROR = chalk.inverse.bold.red(' ERROR ');

builder.on('start', () => {
  if (!builder.watching) {
    console.log();
  }
});

builder.on('build', ({documentPath, definitionPath}) => {
  console.log(`${BUILT} ${chalk.dim(documentPath)} → ${definitionPath}`);
});

builder.on('error', (error) => {
  console.log(`${ERROR} ${error.message}`);
  if (error.stack) { console.log(chalk.dim(error.stack)); }
  console.log();

  if (!builder.watching) {
    process.exit(1);
  }
});

builder.run({watch: argv.watch});
