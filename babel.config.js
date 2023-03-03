/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  const envName = api.env();
  const development = envName === 'development' || envName === 'test';

  return {
    presets: [
      [
        '@babel/preset-env',
        {bugfixes: true, useBuiltIns: 'entry', corejs: '3.0'},
      ],
      ['@babel/preset-typescript'],
      ['@babel/preset-react', {development, useBuiltIns: true}],
    ],
    plugins: [
      // These plugins are handled by preset-env.
      // But they aren't yet supported in webpack 4 because of missing support
      // in acorn v6 (support is in acorn v7, which is used in webpack v5).
      // So we want to always transpile this synax away
      // See https://github.com/webpack/webpack/issues/10227
      // Can be removed once we drop support for webpack v4
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
    ],
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
