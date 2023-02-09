/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  const envName = api.env();

  return {
    targets: getTargetsForEnv(envName),
    presets: [['@shopify/babel-preset', {typescript: true, react: true}]],
    overrides: [
      // Disable useBuiltins and corejs for the polyfills package
      {
        test: 'packages/polyfills',
        presets: [
          [
            '@shopify/babel-preset',
            {typescript: true, react: true, useBuiltIns: false, corejs: false},
          ],
        ],
      },
      // Target current node for loom files
      {
        test: ['config/loom/**/*.ts', '**/loom.config.ts'],
        targets: 'current node',
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
