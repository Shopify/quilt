import {TemplateBuilder} from '@babel/template';
import Types from '@babel/types';
import {Node, NodePath} from '@babel/traverse';

import {
  fallbackTranslationsImport,
  translationsImport,
  i18nCallExpression,
} from './babel-templates';
import {getTranslations, generateID} from './utilities';
import {TRANSLATION_DIRECTORY_NAME, DEFAULT_FALLBACK_LOCALE} from './constants';

export const I18N_CALL_NAMES = ['useI18n', 'withI18n'];

interface Options {
  mode?: 'from-generated-index';
  fallbackLocale?: string;
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
    fallbackID,
    translationID,
    fallbackLocale,
    insertImport,
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

    const translations = getTranslations(filename, TRANSLATION_DIRECTORY_NAME);

    if (translations.length === 0) {
      return;
    }

    insertImport();

    referencePathsToRewrite[0].parentPath.replaceWith(
      i18nCallExpression(template, {
        id: generateID(filename),
        fallbackID,
        translationID,
        bindingName,
        translations,
        fallbackLocale,
      }),
    );
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
        for (const specifier of specifiers) {
          if (
            !t.isImportSpecifier(specifier) ||
            !I18N_CALL_NAMES.includes(specifier.imported.name)
          ) {
            continue;
          }

          const bindingName = specifier.local.name;
          const binding = nodePath.scope.getBinding(bindingName);

          if (!binding) {
            return;
          }

          const {mode, fallbackLocale = DEFAULT_FALLBACK_LOCALE} = state.opts;
          const fromGeneratedIndex = mode === 'from-generated-index' || false;

          const fallbackID = nodePath.scope.generateUidIdentifier(
            fallbackLocale,
          ).name;
          const translationID = fromGeneratedIndex
            ? nodePath.scope.generateUidIdentifier('translation').name
            : undefined;
          const {filename} = this.file.opts;

          addI18nArguments({
            binding,
            bindingName,
            filename,
            fallbackID,
            translationID,
            fallbackLocale,
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
                    id: translationID,
                  }),
                );
              }
            },
          });
        }
      },
    },
  };
}
