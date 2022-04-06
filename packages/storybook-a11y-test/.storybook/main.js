module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-postcss'],
  framework: '@storybook/react',
  features: {
    storyStoreV7: true,
  },
  babel: (config) => {
    // This is to change babel-preset-env and we have to do this manually to prevent polluting the package.json
    const presetEnv = config.presets.find((preset) =>
      preset[0].includes('@babel/preset-env'),
    );
    presetEnv[1] = {
      useBuiltIns: 'usage',
      corejs: 3,
      targets: '> 0.25%, not dead',
      loose: true,
      shippedProposals: true,
    };
    return config;
  },
};
