/* eslint no-console: off */

import {relative, basename} from 'path';

import * as yargs from 'yargs';
import * as glob from 'glob';
import * as chalk from 'chalk';

import {evaluateFixtures} from '.';

const argv = yargs
  .usage('Usage: $0 <fixtures> [options]')
  .option('cwd', {
    required: false,
    default: process.cwd(),
    normalize: true,
    type: 'string',
    describe: 'Working directory where the .graphqlconfig is located',
  })
  .option('show-passes', {
    type: 'boolean',
    default: false,
    describe:
      'Display passing fixtures along with failures in the console output',
  })
  .help().argv;

evaluateFixtures(glob.sync(argv._[0]), {
  cwd: argv.cwd,
})
  .then((evaluations) => {
    let passed = 0;
    let failed = 0;
    let lastFailed = false;

    console.log();

    evaluations.forEach((evaluation) => {
      const relativePath = relative(argv.cwd, evaluation.fixturePath);
      const formattedPath = `${chalk.dim(
        relativePath.replace(basename(relativePath), ''),
      )}${chalk.bold(basename(relativePath))}`;

      if (evaluation.scriptError) {
        failed += 1;
        lastFailed = true;
        console.log(`${chalk.inverse.bold.red(' FAIL ')} ${formattedPath}`);
        console.log(evaluation.scriptError.message);
        if (evaluation.scriptError.stack) {
          console.log(
            chalk.dim(
              evaluation.scriptError.stack
                .replace(evaluation.scriptError.message, '')
                .replace(/^Error:\s*\n/, ''),
            ),
          );
        }
        console.log();
      } else if (evaluation.validationErrors.length === 0) {
        passed += 1;
        lastFailed = false;
        if (argv.showPasses) {
          console.log(`${chalk.inverse.bold.green(' PASS ')} ${formattedPath}`);
        }
      } else {
        failed += 1;
        lastFailed = true;

        console.log(`${chalk.inverse.bold.red(' FAIL ')} ${formattedPath}`);
        evaluation.validationErrors.forEach((error) => {
          console.log(`${error.keyPath} ${chalk.red(error.message)}`);
        });
        console.log();
      }
    });

    if (passed + failed === 0) {
      console.log(chalk.bold.yellow('No tests run'));
      return;
    }

    if (!lastFailed) {
      console.log();
    }

    if (passed > 0) {
      console.log(chalk.bold.green(`${passed} passed`));
    }

    if (failed > 0) {
      console.log(chalk.bold.red(`${failed} failed`));
      process.exit(1);
    }
  })
  .catch((error) => {
    console.log();
    console.log(`${chalk.inverse.bold.red(' ERROR ')} ${error.message}`);
    console.log(
      chalk.dim(
        error.stack.replace(error.message, '').replace(/^Error:\s*\n/, ''),
      ),
    );
    process.exit(1);
  });
