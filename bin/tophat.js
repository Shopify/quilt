#!/usr/bin/env node
const {bold, red} = require('chalk');
const {pathExistsSync} = require('fs-extra');
const {join} = require('path');
const yargs = require('yargs');

const messages = {
  promptForPackage: () =>
    `\n${bold.green(
      'Tip:',
    )} 🎩  your changes by specifying which package to build  e.g.:\n  ${bold(
      'yarn tophat react-form-state ../web',
    )}\n`,
  promptForRepo: () =>
    `\n${bold.green(
      'Tip:',
    )} 🎩  your changes by providing a path to a destination repository.  e.g.:\n  ${bold(
      'yarn tophat ../web',
    )}\n`,
  packageNotFound: packageName =>
    `${red(
      "Can't find",
    )} ${packageName} directory.\nPlease verify that it exists under './packages' \n`,
  repositoryNotFound: destinationRoot =>
    `${red(
      "Can't find",
    )} ${destinationRoot}\nPlease verify that you have cloned this repository.\n`,
  nodeModulesNotFound: destinationRoot =>
    `${red(
      'node_modules not found ',
    )} in ${destinationRoot}.\nPlease run ${bold(
      'yarn install',
    )} in the target repository.\n`,
  destinationPackageNotFound: (packageName, destinationPackage) =>
    `${red("Can't find")} ${destinationPackage}.\nTry running ${bold(
      `yarn add --dev @shopify/${packageName}`,
    )} in the target repository.\n`,
};

process.on('unhandledRejection', error => {
  process.stderr.write(`${error.stack ? error.stack : error}`, () => {
    process.exit(1);
  });
});

yargs
  .usage('Usage: $0 $1 <command> [options]')
  .command({
    command: '* [packageName] [destinationRepository]',
    desc: 'Quickly verify your changes in a local repository',
    builder: {
      packageName: {
        type: 'string',
      },
      destinationRepository: {
        type: 'string',
      },
    },
    handler: async ({packageName, destinationRepository}) => {
      const sourcePackageDirectory = await validateSource(packageName);
      const destinationPackageDirectory = await validateDestination(
        packageName,
        destinationRepository,
      );

      const watcher = require('./watcher');
      watcher(sourcePackageDirectory, destinationPackageDirectory);
    },
  })
  .help().argv;

function outputAndExit(message) {
  process.stdout.write(message, () => {
    process.exit(1);
  });
}

function validateSource(packageName) {
  return new Promise(resolve => {
    const {promptForPackage, packageNotFound} = messages;

    if (!packageName) {
      return outputAndExit(promptForPackage());
    }

    const sourcePackageDirectory = join('packages', packageName);
    console.log(packageName);
    if (!pathExistsSync(sourcePackageDirectory)) {
      return outputAndExit(packageNotFound(sourcePackageDirectory));
    }

    return resolve(sourcePackageDirectory);
  });
}

function validateDestination(packageName, destinationRepository) {
  return new Promise(resolve => {
    const {
      promptForRepo,
      repositoryNotFound,
      nodeModulesNotFound,
      destinationPackageNotFound,
    } = messages;

    if (!destinationRepository) {
      return outputAndExit(promptForRepo());
    }

    const destinationRoot = join(destinationRepository);
    if (!pathExistsSync(destinationRoot)) {
      return outputAndExit(repositoryNotFound(destinationRepository));
    }

    const destinationNodeModules = join(destinationRoot, 'node_modules');
    if (!pathExistsSync(destinationNodeModules)) {
      return outputAndExit(nodeModulesNotFound(destinationRoot));
    }

    const destinationPackage = join(
      destinationRoot,
      'node_modules',
      `@shopify`,
      packageName,
    );
    if (!pathExistsSync(destinationPackage)) {
      outputAndExit(
        destinationPackageNotFound(packageName, destinationPackage),
      );
    }

    return resolve(destinationPackage);
  });
}
