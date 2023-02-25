/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  const envName = api.env();
  const development = envName === 'development' || envName === 'test';

  return {
    targets: getTargetsForEnv(envName),
    presets: [
      [
        '@babel/preset-env',
        {bugfixes: true, useBuiltIns: 'entry', corejs: '3.0'},
      ],
      ['@babel/preset-typescript'],
      ['@babel/preset-react', {development, useBuiltIns: true}],
    ],
    plugins: [
      // class-properties and private-methods are handled by preset-env,
      // however when using the legacy version of decorators - with TypeScript's
      // experimentalDecorators option - you need to add
      // them explicitly after proposal-decorators. Also the setPublicClassFields
      // and privateFieldsAsProperties assumptions must be enabled (which is
      // handled at the bottom of this function).
      // We need to keep class-properties and private-methods around anyway even
      // if we were to remove transpilation of legacy decorators, because they
      // are not supported by webpack 4 because of missing support in acorn v6
      // (support is in acorn v7 which is used by webpack 5).
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',

      // nullish-coalescing, optional-chaining, and numeric separators,
      // are handled by preset-env.
      // But they aren't yet supported in webpack 4 because of missing support
      // in acorn v6 (support is in acorn v7, which is used in webpack v5).
      // So we want to always transpile this synax away
      // See https://github.com/webpack/webpack/issues/10227
      // Can be removed once we drop support for webpack v4 (or these features
      // are backported to acorn v6).
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

function getTargetsForEnv(envName) {
  if (envName == 'test') {
    return 'current node';
  }

  return {};
}
