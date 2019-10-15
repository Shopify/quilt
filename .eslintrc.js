module.exports = {
  extends: [
    require.resolve('./config/eslint'),
    'plugin:shopify/typescript',
    'plugin:shopify/react',
    'plugin:shopify/jest',
    'plugin:shopify/prettier',
  ],
  parserOptions: {
    project: 'tsconfig.json',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'import/no-extraneous-dependencies': 'error',
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
    },
    {
      files: [
        '**/test/**/*.ts',
        '**/test/**/*.tsx',
        '**/tests/**/*.ts',
        '**/tests/**/*.tsx',
      ],
      rules: {
        'shopify/jsx-no-hardcoded-content': 'off',
        // We disable `import/no-extraneous-dependencies` for test files because it
        // would force releases of `@shopify/react-testing` (and similar devDependencies)
        // to cause unnecessary package bumps in every package that consumes them.
        // Test files with extraneous dependencies won't cause runtime errors in production.
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
