const {readdirSync, existsSync} = require('fs');
const path = require('path');

const jsPackageNames = getPackageNames('js');
const gemNames = getPackageNames('ruby');

module.exports = function (plop) {
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
        path: 'packages/{{kebabCase name}}/package.json',
        templateFile: 'templates/package.hbs.json',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/tsconfig.json',
        templateFile: 'templates/tsconfig.hbs.json',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/README.md',
        templateFile: 'templates/README.hbs.md',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/CHANGELOG.md',
        templateFile: 'templates/CHANGELOG.hbs.md',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/index.ts',
        templateFile: 'templates/index.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/{{properCase name}}.ts',
        templateFile: 'templates/my-package.hbs.ts',
      },
      {
        type: 'add',
        path:
          'packages/{{kebabCase name}}/src/test/{{properCase name}}.test.ts',
        templateFile: 'templates/test.hbs.ts',
      },
      {
        type: 'modify',
        path: 'packages/tsconfig.json',
        transform: (file, {name}) => {
          const tsConfig = JSON.parse(file);
          const kebabCase = plop.getHelper('kebabCase');
          tsConfig.references.push({path: `./${kebabCase(name)}`});
          tsConfig.references.sort(({path: firstPath}, {path: secondPath}) =>
            firstPath.localeCompare(secondPath),
          );
          return JSON.stringify(tsConfig);
        },
      },
    ],
  });

  plop.setGenerator('docs', {
    description: 'Generate root repo documentation',
    prompts: [],
    actions: [
      {
        type: 'add',
        path: 'README.md',
        templateFile: 'templates/ROOT_README.hbs.md',
        force: true,
        data: {jsPackageNames, gemNames},
      },
    ],
  });
};

function getPackageNames(type = 'js') {
  const packagesPath = path.join(
    __dirname,
    type === 'js' ? 'packages' : 'gems',
  );
  return readdirSync(packagesPath).filter(packageName => {
    const packageJSONPath = path.join(
      packagesPath,
      packageName,
      'package.json',
    );
    return existsSync(packageJSONPath);
  });
}
