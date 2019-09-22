const {resolve, relative, join} = require('path');
const {readdirSync, lstatSync} = require('fs-extra');

const PACKAGE_DIR = 'packages/@shopify/';

// Sdapted from: https://github.com/benmosher/eslint-plugin-import/issues/1174#issuecomment-509965883
const noExtraneousOverrides = readdirSync(resolve(__dirname, PACKAGE_DIR))
  .filter(
    entry =>
      entry.substr(0, 1) !== '.' &&
      lstatSync(resolve(__dirname, PACKAGE_DIR, entry)).isDirectory(),
  )
  .map(entry => ({
    files: [`${PACKAGE_DIR}${entry}/**/*`],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: true,
          packageDir: [relative(__dirname, join(PACKAGE_DIR, entry))],
        },
      ],
    },
  }));

module.exports = {
  extends: [
    'plugin:shopify/typescript',
    'plugin:shopify/react',
    'plugin:shopify/jest',
    'plugin:shopify/prettier',
  ],
  root: true,
  parserOptions: {
    project: 'tsconfig.json',
  },
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
    'import/external-module-folders': ['packages', 'node_modules'],
  },
};
