const {readdirSync, existsSync} = require('fs');
const path = require('path');

const jsPackages = getPackages('js');
const gems = getPackages('ruby');

module.exports = function (plop) {
  plop.setGenerator('package', {
    description: 'Create a new package from scratch',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "What should this package's name be? Ex. react-utilities",
        validate: validatePackageName,
        filter: plop.getHelper('kebabCase'),
      },
      {
        type: 'input',
        name: 'description',
        message: "What should this package's description be?",
        filter: stripDescription,
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
        path: 'packages/{{name}}/tsconfig.json',
        templateFile: 'templates/tsconfig.hbs.json',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/README.md',
        templateFile: 'templates/README.hbs.md',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/CHANGELOG.md',
        templateFile: 'templates/CHANGELOG.hbs.md',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/src/index.ts',
        templateFile: 'templates/index.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/src/{{properCase name}}.ts',
        templateFile: 'templates/my-package.hbs.ts',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/src/test/{{properCase name}}.test.ts',
        templateFile: 'templates/test.hbs.ts',
      },
      {
        type: 'modify',
        path: 'packages/tsconfig.json',
        transform: (file, {name}) => {
          const tsConfig = JSON.parse(file);
          tsConfig.references.push({path: `./${name}`});
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
        data: {jsPackages, gems},
      },
    ],
  });
};

function getPackages(type = 'js') {
  const packagesPath = path.join(
    __dirname,
    type === 'js' ? 'packages' : 'gems',
  );

  return readdirSync(packagesPath).reduce((acc, packageName) => {
    const packageJSONPath = path.join(
      packagesPath,
      packageName,
      'package.json',
    );

    if (existsSync(packageJSONPath)) {
      const {name, description} = require(packageJSONPath);

      acc.push({name: name.replace('@shopify/', ''), description});
    }

    return acc;
  }, []);
}

function validatePackageName(name) {
  return (
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/g.test(
      `@shopify/${name}`,
    ) || `Your package name (@shopify/${name}) does not confirm to npm rules!`
  );
}

function stripDescription(desc) {
  return desc.replace(/[.\s]*$/g, '').replace(/^\s*/g, '');
}
