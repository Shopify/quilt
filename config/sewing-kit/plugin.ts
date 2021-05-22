import {BabelConfig, updateBabelPlugin} from '@sewing-kit/plugin-javascript';

export async function addLegacyDecoratorSupport(config: BabelConfig) {
  let newConfig = config;

  newConfig = await updateBabelPlugin(
    [
      '@babel/plugin-proposal-class-properties',
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
    {loose: true},
  )(newConfig);

  // The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods
  newConfig = await updateBabelPlugin(
    [
      '@babel/plugin-proposal-private-methods',
      require.resolve('@babel/plugin-proposal-private-methods'),
    ],
    {loose: true},
  )(newConfig);

  newConfig = await updateBabelPlugin(
    [
      '@babel/plugin-proposal-decorators',
      require.resolve('@babel/plugin-proposal-decorators'),
    ],
    () => ({legacy: true}),
  )(newConfig);

  return newConfig;
}
