import {BabelConfig} from '@sewing-kit/plugin-javascript';

export function addLegacyDecoratorSupport(config: BabelConfig): BabelConfig {
  return {
    presets: config.presets,
    plugins: (config.plugins || []).map(plugin => {
      const pluginName = getPluginName(plugin);

      if (pluginName.includes('@babel/plugin-proposal-decorators')) {
        return [pluginName, {legacy: true}];
      } else if (
        pluginName.includes('@babel/plugin-proposal-class-properties')
      ) {
        return [pluginName, {loose: true}];
      } else {
        return plugin;
      }
    }),
  };
}

export function addReactPreset(config: BabelConfig): BabelConfig {
  const alreadyContainsPreset = config.presets.some(preset =>
    getPluginName(preset).includes('@babel/preset-react'),
  );

  return alreadyContainsPreset
    ? config
    : {
        ...config,
        presets: [
          ...config.presets,
          ['@babel/preset-react', {development: false, useBuiltIns: true}],
        ],
      };
}

function getPluginName(plugin): string {
  return Array.isArray(plugin) ? plugin[0] : plugin;
}
