const path = require('path');
const {resolve} = require('path');
const {readdirSync, lstatSync} = require('fs');

const PACKAGE_DIR = 'packages/'; // this could be replaced utilizing the globs in package.json's "workpackges" or from the lerna.json config

// get files in packages
const noExtraneousOverrides = readdirSync(resolve(__dirname, PACKAGE_DIR))
  // filter for non-hidden dirs to get a list of packages
  .filter(
    entry =>
      entry.substr(0, 1) !== '.' &&
      lstatSync(resolve(__dirname, PACKAGE_DIR, entry)).isDirectory(),
  )
  // map to override rules pointing to local and root package.json for rule
  .map(entry => ({
    files: [`${PACKAGE_DIR}${entry}/**/*`],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          packageDir: [__dirname, resolve(__dirname, PACKAGE_DIR, entry)],
        },
      ],
    },
  }));

console.log(noExtraneousOverrides);
module.exports = {
  extends: [
    'plugin:shopify/typescript',
    'plugin:shopify/react',
    'plugin:shopify/jest',
    'plugin:shopify/prettier',
  ],
  parserOptions: {
    project: 'tsconfig.json',
  },
  root: true,
  rules: {
    'import/extensions': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'node/no-extraneous-require': 'off',
    'import/no-cycle': 'off',
    'jest/require-tothrow-message': 'off',
    'callback-return': 'off',
    'jest/no-if': 'off',
    'import/named': 'off',
    'func-style': 'off',
    'react/display-name': 'off',
    'shopify/restrict-full-import': ['error', 'lodash'],
    'shopify/jsx-no-hardcoded-content': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {packageDir: ['./packages/react-server-webpack-plugin', './']},
    ],
    'shopify/jest/no-vague-titles': [
      'error',
      {
        allow: ['all'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        rules: {'shopify/jsx-no-hardcoded-content': 'off'},
      },
    },
    ...noExtraneousOverrides,
  ],
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: path.resolve(__dirname, 'packages'),
      },
    },
  },
};
