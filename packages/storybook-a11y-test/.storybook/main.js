module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [],
  framework: '@storybook/react',
  features: {
    storyStoreV7: true,
  },
  typescript: {
    reactDocgen: false,
  },
  babel: (config) => {
    return {...config, targets: 'last 3 chrome versions'};
  },
};
