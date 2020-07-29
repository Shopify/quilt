import {BabelConfig, updateBabelPlugin} from '@sewing-kit/plugin-javascript';

export async function addLegacyDecoratorSupport(config: BabelConfig) {
  const updateProposalDecorators = updateBabelPlugin(
    [
      '@babel/plugin-proposal-decorators',
      require.resolve('@babel/plugin-proposal-decorators'),
    ],
    () => ({
      legacy: true,
    }),
  );
  const updateClassProps = updateBabelPlugin(
    [
      '@babel/plugin-proposal-class-properties',
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
    {
      loose: true,
    },
  );

  let newConfig = await updateClassProps(config);
  newConfig = await updateProposalDecorators(newConfig);

  return newConfig;
}
