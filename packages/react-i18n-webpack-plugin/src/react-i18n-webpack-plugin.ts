import webpack, {Parser} from 'webpack';
import VirtualModulesPlugin from 'webpack-virtual-modules';

import {ReactI18nParserPlugin, Options} from './react-i18n-parser-plugin';

export const defaultOptions: Options = {
  fallbackLocale: 'en',
};

export class ReactI18nPlugin {
  private options: Options;
  private virtualModules = new VirtualModulesPlugin();

  constructor(options: Partial<Options> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  apply(compiler: webpack.Compiler) {
    this.virtualModules.apply(compiler);

    compiler.hooks.normalModuleFactory.tap(
      'ReactI18nPlugin',
      (normalModuleFactory: webpack.compilation.NormalModuleFactory) => {
        const handler = (parser: Parser) => {
          new ReactI18nParserPlugin(this.options, this.virtualModules).apply(
            parser,
          );
        };

        normalModuleFactory.hooks.parser
          .for('javascript/auto')
          .tap('HarmonyModulesPlugin', handler);

        normalModuleFactory.hooks.parser
          .for('javascript/esm')
          .tap('HarmonyModulesPlugin', handler);

        normalModuleFactory.hooks.parser
          .for('javascript/dynamic')
          .tap('HarmonyModulesPlugin', handler);
      },
    );
  }
}
