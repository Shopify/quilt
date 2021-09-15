const {readdirSync, readFileSync, existsSync} = require('fs');
const path = require('path');
const glob = require('glob');
const prettier = require('prettier');

const jsPackages = getJsPackages();
const gems = getRubyPackages();

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
        path: 'packages/{{name}}/src/tests/{{properCase name}}.test.ts',
        templateFile: 'templates/test.hbs.ts',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/loom.config.ts',
        templateFile: 'templates/loom.templateconfig.hbs.ts',
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
    actions: jsPackages.reduce((acc, {unscopedName: packageName}) => {
      const packagePath = path.join(__dirname, 'packages', packageName);
      const packageJSONPath = path.join(packagePath, 'package.json');

      const packageJSON = require(packageJSONPath);
      const entrypoints = glob
        .sync(`${packagePath}/*.js`)
        .map((entrypoint) => path.basename(entrypoint).slice(0, -3));
      const hasIndex = entrypoints.includes('index');

      if (hasIndex) {
        packageJSON.main = 'index.js';
        packageJSON.module = 'index.mjs';
        packageJSON.esnext = 'index.esnext';
        packageJSON.types = 'build/ts/index.d.ts';
      }
      packageJSON.exports = {'./': './'};
      entrypoints.forEach((entrypoint) => {
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
        ['build/*', '!build/*.tsbuildinfo'],
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

function getJsPackages() {
  const packagesPath = path.join(__dirname, 'packages');

  return readdirSync(packagesPath).reduce((acc, packageName) => {
    const packageJSONPath = path.join(
      packagesPath,
      packageName,
      'package.json',
    );

    if (existsSync(packageJSONPath)) {
      const {name, description} = require(packageJSONPath);

      acc.push({
        name,
        urlEncodedName: encodeURIComponent(name),
        unscopedName: name.replace('@shopify/', ''),
        description,
      });
    }

    return acc;
  }, []);
}

function getRubyPackages() {
  const packagesPath = path.join(__dirname, 'gems');

  return readdirSync(packagesPath).reduce((acc, packageName) => {
    const gemSpecPath = path.join(
      packagesPath,
      packageName,
      `${packageName}.gemspec`,
    );

    if (existsSync(gemSpecPath)) {
      const specSrc = readFileSync(gemSpecPath, 'utf-8');

      const spec = {};
      const specRe = /\bspec\.(\w+)\s*=\s*(.+)\n/gm;

      while (true) {
        const matches = specRe.exec(specSrc);

        if (!matches) {
          break;
        }

        const [_, key, value] = matches;

        try {
          spec[key] = JSON.parse(value);
        } catch (_) {
          spec[key] = value;
        }
      }

      const {name, description} = spec;

      acc.push({
        name,
        urlEncodedName: encodeURIComponent(name),
        description,
      });
    }

    return acc;
  }, []);
}

function validatePackageName(name) {
  return (
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/g.test(
      `@shopify/${name}`,
    ) || `Your package name (@shopify/${name}) does not conform to npm rules!`
  );
}

function stripDescription(desc) {
  return desc.replace(/[.\s]*$/g, '').replace(/^\s*/g, '');
}

function prettyStringify(jsonObj) {
  return prettier.format(JSON.stringify(jsonObj), {
    parser: 'json',
    bracketSpacing: false,
  });
}
