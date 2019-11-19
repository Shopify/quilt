import path from 'path';

import webpack from 'webpack';
import ParserHelpers from 'webpack/lib/ParserHelpers';

const PLUGIN_NAME = 'ReactI18nCacheBusterPlugin';
const TRANSLATION_DIRECTORY_NAME = 'translations';
// const I18N_CALL_NAMES = ['useI18n', 'withI18n'];

export interface Options {
  fallbackLocale: string;
  currentLocale?: string;
}

export const defaultOptions: Options = {
  fallbackLocale: 'en',
};

export class ReactI18nCacheBusterPlugin {
  private options: Options;

  constructor(options: Partial<Options> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.normalModuleFactory.tap(
      PLUGIN_NAME,
      (normalModuleFactory: webpack.compilation.NormalModuleFactory) => {
        const handler = (parser: any) => {
          parser.hooks.statement.tap(PLUGIN_NAME, statement => {
            if (
              parser.state.module.resource.indexOf('node_modules') !== -1 ||
              statement.type !== 'VariableDeclaration' ||
              statement.declarations[0].id.name !==
                '__shopify__i18n_translations'
            ) {
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

            const availableTranslations = translationFiles
              .filter(
                translationFile =>
                  !translationFile.endsWith(
                    `${this.options.fallbackLocale}.json`,
                  ),
              )
              .map(translationFile =>
                JSON.stringify(
                  path.basename(translationFile, path.extname(translationFile)),
                ),
              )
              .sort()
              .join(', ');

            ParserHelpers.toConstantDependency(
              parser,
              `[${availableTranslations}]`,
            )(statement.declarations[0].init);
          });
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
