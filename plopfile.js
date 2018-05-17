const {promisify} = require('util');
const fs = require('fs');

const symlink = promisify(fs.symlink);
const unlink = promisify(fs.unlink);

const ConfigPaths = {
  ESlint: '../../.eslintrc',
  ESlintIgnore: '../../.eslintignore',
  TSConfig: '../../tsconfig.full.json',
};

module.exports = function(plop) {
  plop.setGenerator('package', {
    description: 'create a new package from scratch',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "What should this package's name be? Ex. react-utilities",
      },
      {
        type: 'input',
        name: 'description',
        message: "What should this package's description be?",
      },
      {
        type: 'confirm',
        name: 'usedInBrowser',
        message: 'Is this package intended for use in the browser?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{name}}/package.json',
        templateFile: 'templates/package.hbs.json',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/README.md',
        templateFile: 'templates/README.hbs.md',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/src/index.ts',
        templateFile: 'templates/index.hbs.ts',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/src/test/index.test.ts',
        templateFile: 'templates/test.hbs.ts',
      },
      {
        type: 'symlink',
        source: ConfigPaths.TSConfig,
        destination: 'packages/{{name}}/tsconfig.json',
      },
      {
        type: 'symlink',
        source: ConfigPaths.ESlint,
        destination: 'packages/{{name}}/.eslintrc',
      },
      {
        type: 'symlink',
        source: ConfigPaths.ESlintIgnore,
        destination: 'packages/{{name}}/.eslintignore',
      },
    ],
  });

  plop.setGenerator('symlinks', {
    description: 'regenerate config file symlinks for a package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Regenerate symlinks for which package?',
      },
    ],
    actions: [
      {
        type: 'symlink',
        source: ConfigPaths.TSConfig,
        destination: 'packages/{{name}}/tsconfig.json',
      },
      {
        type: 'symlink',
        source: ConfigPaths.ESlint,
        destination: 'packages/{{name}}/.eslintrc',
      },
      {
        type: 'symlink',
        source: ConfigPaths.ESlintIgnore,
        destination: 'packages/{{name}}/.eslintignore',
      },
    ],
  });

  plop.setActionType('symlink', async (answers, config, plop) => {
    const {name} = answers;
    const {source, destination} = config;
    const resolvedDestination = destination.replace('{{name}}', name);

    try {
      await unlink(resolvedDestination);
    } catch (error) {}
    await symlink(source, resolvedDestination);

    return `symlink ${resolvedDestination} -> ${source}`;
  });
};
