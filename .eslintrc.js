module.exports = {
  extends: [
    'plugin:@shopify/typescript',
    'plugin:@shopify/typescript-type-checking',
    'plugin:@shopify/react',
    'plugin:@shopify/jest',
    'plugin:@shopify/prettier',
  ],
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
  },
  rules: {
    'jest/valid-expect-in-promise': 'off',
    'import/extensions': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'node/no-extraneous-require': 'off',
    'import/no-cycle': 'off',
    'jest/require-tothrow-message': 'off',
    'callback-return': 'off',
    'func-style': 'off',
    'react/display-name': 'off',
    '@shopify/restrict-full-import': ['error', 'lodash'],
    '@shopify/jsx-no-hardcoded-content': 'off',
    // reports false positives with React's useRef hook
    'require-atomic-updates': 'off',
    '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/await-thenable': 'off',
    'import/no-extraneous-dependencies': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@faker-js/faker',
            message: "Please use '@faker-js/faker/locale/en' instead",
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        // Enforce camelCase naming convention and PascalCase class and interface names
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            selector: 'default',
            filter: {
              match: true,
              // Allow double underscores and React UNSAFE_ (for lifecycle hooks that are to be deprecated)
              regex: '^(__|UNSAFE_).+$',
            },
            format: null,
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
        ],
      },
    },
    {
      files: [
        '**/tests/**/*.ts',
        '**/tests/**/*.tsx',
        '**/loom.config.ts',
        '**/*.test-d.ts',
        '**/*.test-d.tsx',
      ],
      rules: {
        // We disable `import/no-extraneous-dependencies` for test files because it
        // would force releases of `@shopify/react-testing` (and similar devDependencies)
        // to cause unnecessary package bumps in every package that consumes them.
        // Test files with extraneous dependencies won't cause runtime errors in production.
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-no-constructed-context-values': 'off',
        'react/jsx-key': 'off',
        '@shopify/react-require-autocomplete': 'off',
      },
    },
    {
      files: ['**/tests/fixtures/**/*'],
      rules: {
        '@shopify/typescript/prefer-pascal-case-enums': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-unnecessary-qualifier': 'off',
        'babel/object-curly-spacing': 'off',
        'prettier/prettier': 'off',
        'import/newline-after-import': 'off',
        'import/order': 'off',
      },
    },
    {
      files: ['**/loom.config.ts', 'config/loom/index.ts'],
      rules: {
        'babel/no-unused-expressions': 'off',
      },
    },
  ],
};
