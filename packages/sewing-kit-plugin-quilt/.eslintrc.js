module.exports = {
  overrides: [
    {
      files: [
        'src/*.ts',
      ],
      rules: {
        // We disable `import/no-extraneous-dependencies` for test files because it
        // would force releases of `@shopify/react-testing` (and similar devDependencies)
        // to cause unnecessary package bumps in every package that consumes them.
        // Test files with extraneous dependencies won't cause runtime errors in production.
        'babel/no-unused-expressions': 'off',
      },
    },
  ],
};
