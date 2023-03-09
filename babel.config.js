/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  const envName = api.env();
  const development = envName === 'development' || envName === 'test';

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          bugfixes: true,
          useBuiltIns: 'entry',
          corejs: '3.0',
          // Always include these transformations, as we want to maintain
          // webpack v4 support for esnext builds until the next major release.
          // These syntaxes are not supported in acorn v6 (used by webpack v4),
          // so we must transpile them away if we want webpack v4 support
          // See https://github.com/webpack/webpack/issues/10227
          include: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-private-methods',
            '@babel/plugin-proposal-numeric-separator',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-optional-chaining',
          ],
        },
      ],
      ['@babel/preset-typescript'],
      ['@babel/preset-react', {development, useBuiltIns: true}],
    ],
    plugins: [],
    assumptions: {
      setPublicClassFields: true,
      privateFieldsAsProperties: true,
    },
    overrides: [
      // Disable useBuiltins and corejs for the polyfills package
      {
        test: 'packages/polyfills',
        presets: [
          [
            '@babel/preset-env',
            {bugfixes: true, useBuiltIns: false, corejs: false},
          ],
        ],
      },
    ],
  };
};
