const {readdirSync, existsSync} = require('fs');
const path = require('path');
const glob = require('glob');

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
        type: 'add',
        path: 'packages/{{name}}/sewing-kit.config.ts',
        templateFile: 'templates/sewing-kit.templateconfig.hbs.ts',
      },
      {
        type: 'modify',
        path: 'tsconfig.json',
        transform: (file, {name}) => {
          const tsConfig = JSON.parse(file);
          tsConfig.references.push({path: `./packages/${name}`});
          tsConfig.references.sort(({path: firstPath}, {path: secondPath}) =>
            firstPath.localeCompare(secondPath),
          );
          return prettyStringify(tsConfig);
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

  plop.setGenerator('entrypoints', {
    description: 'Update package.json files using the generated entrypoints',
    prompts: [],
    actions: jsPackages.reduce((acc, {name: packageName}) => {
      const packagePath = path.join(__dirname, 'packages', packageName);
      const packageJSONPath = path.join(packagePath, 'package.json');

      const packageJSON = require(packageJSONPath);
      const entrypoints = glob
        .sync(`${packagePath}/*.js`)
        .map(entrypoint => path.basename(entrypoint).slice(0, -3));
      const hasIndex = entrypoints.includes('index');

      if (hasIndex) {
        packageJSON.main = 'index.js';
        packageJSON.module = 'index.mjs';
        packageJSON.esnext = 'index.esnext';
        packageJSON.types = 'index.d.ts';
      }
      packageJSON.exports = {'./': './'};
      entrypoints.forEach(entrypoint => {
        packageJSON.exports[
          entrypoint === 'index' ? '.' : `./${entrypoint}`
        ] = {
          import: `./${entrypoint}.mjs`,
          require: `./${entrypoint}.js`,
          esnext: `./${entrypoint}.esnext`,
        };
      });

      packageJSON.files = entrypoints.reduce(
        (acc, entrypoint) => {
          return acc.concat([
            `${entrypoint}.js`,
            `${entrypoint}.mjs`,
            `${entrypoint}.esnext`,
            `${entrypoint}.d.ts`,
          ]);
        },
        ['build/*', '!tsconfig.tsbuildinfo'],
      );

      acc.push({
        type: 'modify',
        path: packageJSONPath,
        transform: () => prettyStringify(packageJSON),
      });

      return acc;
    }, []),
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

function prettyStringify(jsonObj) {
  return JSON.stringify(jsonObj, undefined, 2) + '\n';
}
