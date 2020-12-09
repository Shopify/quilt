import {BabelConfig, updateBabelPlugin} from '@sewing-kit/plugin-javascript';

export function addLegacyDecoratorSupport(config: BabelConfig) {
  return updateBabelPlugin(
    [
      '@babel/plugin-proposal-class-properties',
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
    {
      loose: true,
    },
  )(config).then(babelConfig => {
    return updateBabelPlugin(
      [
        '@babel/plugin-proposal-decorators',
        require.resolve('@babel/plugin-proposal-decorators'),
      ],
      () => ({
        legacy: true,
      }),
    )(babelConfig);
  });
}
