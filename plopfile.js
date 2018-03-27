module.exports = function(plop) {
  // controller generator
  plop.setGenerator('package', {
    description: 'create a new package from scratch',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "What should this package's name be? Ex. react-utilities",
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{name}}/package.json',
        templateFile: 'templates/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/tsconfig.json',
        templateFile: 'templates/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/README.md',
        templateFile: 'templates/README.md.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{name}}/src/index.ts',
        templateFile: 'templates/index.ts.hbs',
      },
    ],
  });
};
