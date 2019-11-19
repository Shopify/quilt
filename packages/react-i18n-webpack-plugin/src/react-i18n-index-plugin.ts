import path from 'path';

import webpack, {Parser} from 'webpack';
import VirtualModulesPlugin from 'webpack-virtual-modules';

const PLUGIN_NAME = 'ReactI18nIndexPlugin';
const TRANSLATION_DIRECTORY_NAME = 'translations';
const I18N_CALL_NAMES = ['useI18n', 'withI18n'];

export interface Options {
  fallbackLocale: string;
  currentLocale?: string;
}

export const defaultOptions: Options = {
  fallbackLocale: 'en',
};

export class ReactI18nIndexPlugin {
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
      PLUGIN_NAME,
      (normalModuleFactory: webpack.compilation.NormalModuleFactory) => {
        const handler = (parser: Parser) => {
          parser.hooks.importSpecifier.tap(
            PLUGIN_NAME,
            (_statement, _source, exportName: string) => {
              if (!I18N_CALL_NAMES.includes(exportName)) {
                return;
              }

              const componentDirectory = parser.state.module.context;
              const translationsDirectoryPath = `${componentDirectory}/${TRANSLATION_DIRECTORY_NAME}`;

              let translationFiles: string[] = [];
              try {
                translationFiles = parser.state.compilation.compiler.inputFileSystem.readdirSync(
                  translationsDirectoryPath,
                );
              } catch (error) {
                // do nothing if the directory does not exist
              }

              if (translationFiles.length === 0) {
                return;
              }

              const indexPath = `${componentDirectory}/${TRANSLATION_DIRECTORY_NAME}/index.js`;
              const availableTranslations = translationFiles
                .filter(
                  translationFile =>
                    !translationFile.endsWith(
                      `${this.options.fallbackLocale}.json`,
                    ),
                )
                .map(translationFile =>
                  JSON.stringify(
                    path.basename(
                      translationFile,
                      path.extname(translationFile),
                    ),
                  ),
                )
                .sort()
                .join(', ');
              const indexSource = `export default [${availableTranslations}];`;

              this.virtualModules.writeModule(indexPath, indexSource);
            },
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
