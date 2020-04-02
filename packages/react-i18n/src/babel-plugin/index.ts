import path from 'path';

import glob from 'glob';
import stringHash from 'string-hash';
import {camelCase} from 'change-case';
import {TemplateBuilder} from '@babel/template';
import Types from '@babel/types';
import {Node, NodePath} from '@babel/traverse';

import {
  fallbackTranslationsImport,
  translationsImport,
  i18nCallExpression,
  i18nGeneratedDictionaryCallExpression,
} from './babel-templates';
import {TRANSLATION_DIRECTORY_NAME, DEFAULT_FALLBACK_LOCALE} from './shared';

export const I18N_CALL_NAMES = ['useI18n', 'withI18n'];

export interface Options {
  mode?: 'from-generated-index' | 'from-dictionary-index';
  defaultLocale?: string;
}

interface State {
  program: NodePath<Types.Program>;
  opts: Options;
}

export default function injectWithI18nArguments({
  types: t,
  template,
}: {
  types: typeof Types;
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>;
}) {
  function addI18nArguments({
    binding,
    bindingName,
    filename,
    insertImport,
    rewritei18nCall,
  }) {
    const {referencePaths} = binding;

    const referencePathsToRewrite = referencePaths.filter(referencePath => {
      const parent: Node = referencePath.parent;
      return (
        parent.type === 'CallExpression' &&
        (!parent.arguments || parent.arguments.length === 0)
      );
    });

    if (referencePathsToRewrite.length === 0) {
      return;
    }

    if (referencePathsToRewrite.length > 1) {
      throw new Error(
        `You attempted to use ${bindingName} ${
          referencePathsToRewrite.length
        } times in a single file. This is not supported by the Babel plugin that automatically inserts translations.`,
      );
    }

    const translationFilePaths = getTranslationFilePaths(
      filename,
      TRANSLATION_DIRECTORY_NAME,
    );

    if (translationFilePaths.length === 0) {
      return;
    }

    insertImport();
    rewritei18nCall(referencePathsToRewrite[0], translationFilePaths);
  }

  return {
    visitor: {
      Program(nodePath: NodePath<Types.Program>, state: State) {
        state.program = nodePath;
      },
      ImportDeclaration(
        nodePath: NodePath<Types.ImportDeclaration>,
        state: State,
      ) {
        if (nodePath.node.source.value !== '@shopify/react-i18n') {
          return;
        }

        const {specifiers} = nodePath.node;
        specifiers.forEach(specifier => {
          if (
            !t.isImportSpecifier(specifier) ||
            !I18N_CALL_NAMES.includes(specifier.imported.name)
          ) {
            return;
          }

          const bindingName = specifier.local.name;
          const binding = nodePath.scope.getBinding(bindingName);

          if (!binding) {
            return;
          }

          const {mode, defaultLocale} = state.opts;
          const fallbackLocale = defaultLocale
            ? defaultLocale
            : DEFAULT_FALLBACK_LOCALE;

          const fallbackID = nodePath.scope.generateUidIdentifier(
            camelCase(fallbackLocale),
          ).name;
          const {filename} = this.file.opts;

          if (mode === 'from-dictionary-index') {
            const translationArrayID = '__shopify__i18n_translations';
            addI18nArguments({
              binding,
              bindingName,
              filename,
              insertImport() {
                const {program} = state;

                program.node.body.unshift(
                  translationsImport(template, {
                    id: translationArrayID,
                  }),
                );
              },
              rewritei18nCall(referencePathToRewrite) {
                referencePathToRewrite.parentPath.replaceWith(
                  i18nGeneratedDictionaryCallExpression(template, {
                    id: generateID(filename),
                    translationsID: translationArrayID,
                    bindingName,
                  }),
                );
              },
            });
            return;
          }

          const fromGeneratedIndex = mode === 'from-generated-index';
          const translationArrayID = fromGeneratedIndex
            ? '__shopify__i18n_translations'
            : undefined;

          addI18nArguments({
            binding,
            bindingName,
            filename,
            insertImport() {
              const {program} = state;
              program.node.body.unshift(
                fallbackTranslationsImport(template, {
                  id: fallbackID,
                  fallbackLocale,
                }),
              );

              if (fromGeneratedIndex) {
                program.node.body.unshift(
                  translationsImport(template, {
                    id: translationArrayID,
                  }),
                );
              }
            },
            rewritei18nCall(referencePathToRewrite, translationFilePaths) {
              referencePathToRewrite.parentPath.replaceWith(
                i18nCallExpression(template, {
                  id: generateID(filename),
                  fallbackID,
                  translationArrayID,
                  bindingName,
                  translationFilePaths,
                  fallbackLocale,
                }),
              );
            },
          });
        });
      },
    },
  };
}

function getTranslationFilePaths(
  filename: string,
  translationDirName,
): string[] {
  return glob.sync(
    path.resolve(path.dirname(filename), translationDirName, '*.json'),
    {
      nodir: true,
    },
  );
}

// based on postcss-modules implementation
// see https://github.com/css-modules/postcss-modules/blob/60920a97b165885683c41655e4ca594d15ec2aa0/src/generateScopedName.js
function generateID(filename: string) {
  const hash = stringHash(filename)
    .toString(36)
    .substr(0, 5);
  const extension = path.extname(filename);
  const legible = path.basename(filename, extension);
  return `${legible}_${hash}`;
}
