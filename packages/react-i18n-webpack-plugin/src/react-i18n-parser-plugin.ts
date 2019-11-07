import VirtualModulesPlugin from 'webpack-virtual-modules';
import ParserHelpers from 'webpack/lib/ParserHelpers';
import {CallExpression} from 'estree';

import {buildI18nOptions} from './i18n-options';
import {generateID} from './utilities';

const PLUGIN_NAME = 'ReactI18nParserPlugin';
const TRANSLATION_DIRECTORY_NAME = 'translations';
const I18N_CALL_NAMES = ['useI18n', 'withI18n'];

export interface Options {
  fallbackLocale: string;
}

export class ReactI18nParserPlugin {
  private options: Options;
  private virtualModules: VirtualModulesPlugin;

  constructor(options: Options, virtualModules: VirtualModulesPlugin) {
    this.options = options;
    this.virtualModules = virtualModules;
  }

  apply(parser) {
    // get all the import and the identifier
    parser.hooks.importSpecifier.tap(
      PLUGIN_NAME,
      (_statement, _source, exportName: string, identifierName: string) => {
        if (!I18N_CALL_NAMES.includes(exportName)) {
          return;
        }

        const componentPath = parser.state.module.resource;

        if (!parser.state.i18nImports)
          parser.state.i18nImports = new Map<string, string>();

        let exitingImportMap = parser.state.i18nImports.get(componentPath);
        if (!exitingImportMap) {
          exitingImportMap = [];
        }

        exitingImportMap.push(identifierName);
        parser.state.i18nImports.set(componentPath, exitingImportMap);
      },
    );

    // replace useI18n & withI18n call arguments
    parser.hooks.evaluate
      .for('CallExpression')
      .tap(PLUGIN_NAME, (originalExpression: CallExpression) => {
        if (
          parser.state.module.resource.indexOf('node_modules') !== -1 ||
          !parser.state.i18nImports
        ) {
          return;
        }

        const componentPath = parser.state.module.resource;
        const componentDir = parser.state.module.context;
        const importIdentifiers = parser.state.i18nImports.get(componentPath);

        if (
          !importIdentifiers ||
          originalExpression.callee.type !== 'Identifier'
        ) {
          return;
        }

        const expressions: CallExpression[] = [];

        if (
          importIdentifiers.includes(originalExpression.callee.name) &&
          originalExpression.arguments.length === 0
        ) {
          expressions.push(originalExpression);
        } else if (originalExpression.callee.name === 'compose') {
          originalExpression.arguments.map(node => {
            if (
              node.type === 'CallExpression' &&
              node.callee.type === 'Identifier'
            ) {
              const identifierName = importMap.get(node.callee.name);

              if (identifierName && node.arguments.length === 0) {
                expressions.push(node);
              }
            }
          });
        }

        // skip calls where consumer manually added arguments
        if (expressions.length === 0) {
          return;
        }

        let translationFiles = [];

        const componentDirectory = parser.state.module.context;
        const translationsDirectoryPath = `${componentDirectory}/${TRANSLATION_DIRECTORY_NAME}`;

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

        // add i18n options dynamically from a virtual module
        const componentFileName = componentPath
          .split('/')
          .pop()!
          .split('.')[0];
        const id = generateID(componentFileName);
        const i18nOptionsName = `__webpack__i18n__${generateID('i18nOptions')}`;

        const optionsPath = `${componentDir}/${TRANSLATION_DIRECTORY_NAME}/i18nOptions.js`;
        const optionsSource = buildI18nOptions({
          id,
          chunkName: `${id}-i18n`,
          fallbackLocale: this.options.fallbackLocale,
          translationFiles,
        });
        this.virtualModules.writeModule(optionsPath, optionsSource);

        const asyncTranslationFactoryExpression = ParserHelpers.requireFileAsExpression(
          parser.state.module.context,
          optionsPath,
        );
        ParserHelpers.addParsedVariableToModule(
          parser,
          i18nOptionsName,
          asyncTranslationFactoryExpression,
        );

        // Replace i18n call arguments
        expressions.map(expression => {
          ParserHelpers.toConstantDependency(
            parser,
            `(${i18nOptionsName}.i18nOptions)`,
          )(expression);
        });
      });
  }
}
