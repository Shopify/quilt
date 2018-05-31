module.exports = function(plop) {
  // package generator
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
        path: 'packages/{{name}}/src/index.ts',
        templateFile: 'templates/index.hbs.ts',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/src/test/index.test.ts',
        templateFile: 'templates/test.hbs.ts',
      },
    ],
  });

  // docs generator
  plop.setGenerator('docs', {
    description: 'Generate root repo documentation',
    prompts: [],
    actions(data) {
      const {
        readdirSync,
        existsSync,
        readFileSync,
        writeFileSync,
      } = require('fs');
      const path = require('path');

      const packagesPath = path.join(__dirname, 'packages');
      const packageNames = readdirSync(packagesPath).filter(packageName => {
        const packageJSONPath = path.join(
          packagesPath,
          packageName,
          'package.json',
        );
        return existsSync(packageJSONPath);
      });

      return [
        {
          type: 'add',
          path: 'README.md',
          templateFile: 'templates/ROOT_README.hbs.md',
          force: true,
          data: {packageNames},
        },
      ];
    },
  });
};
