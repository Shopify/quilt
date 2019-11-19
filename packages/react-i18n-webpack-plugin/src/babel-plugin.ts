import path from 'path';

import glob from 'glob';
import {TemplateBuilder} from '@babel/template';
import Types from '@babel/types';
import {Node, NodePath} from '@babel/traverse';
import stringHash from 'string-hash';

interface State {
  program: NodePath<Types.Program>;
}

export default function injectWithI18nArguments({
  types: t,
  template,
}: {
  types: typeof Types;
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>;
}) {
  function fallbackTranslationsImport({id}) {
    return template(`import ${id} from './translations/en.json';`, {
      sourceType: 'module',
    })() as Types.ImportDeclaration;
  }

  function i18nCallExpression({id, fallbackID, bindingName, translations}) {
    return template(
      `${bindingName}({
        id: '${id}',
        fallback: ${fallbackID},
        translations(locale) {
          const __shopify__i18n_translations = [${translations
            .filter(locale => !locale.endsWith('en.json'))
            .map(locale =>
              JSON.stringify(path.basename(locale, path.extname(locale))),
            )
            .sort()
            .join(', ')}];
          if (__shopify__i18n_translations.indexOf(locale) < 0) {
            return;
          }
          return (async () => {
            const dictionary = await import(/* webpackChunkName: "${id}-i18n", webpackMode: "lazy-once" */ \`./translations/$\{locale}.json\`);
            return dictionary && dictionary.default;
          })();
        },
      })`,
      {
        sourceType: 'module',
        plugins: ['dynamicImport'],
        preserveComments: true,
      },
    )();
  }

  function addI18nArguments({
    binding,
    bindingName,
    filename,
    fallbackID,
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

    const translations = getTranslations(filename);

    if (translations.length === 0) {
      return;
    }

    insertImport();

    referencePathsToRewrite[0].parentPath.replaceWith(
      i18nCallExpression({
        id: generateID(filename),
        fallbackID,
        bindingName,
        translations,
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
            (specifier.imported.name !== 'withI18n' &&
              specifier.imported.name !== 'useI18n')
          ) {
            continue;
          }

          const bindingName = specifier.local.name;
          const binding = nodePath.scope.getBinding(bindingName);

          if (binding != null) {
            const fallbackID = nodePath.scope.generateUidIdentifier('en').name;
            const {filename} = this.file.opts;

            addI18nArguments({
              binding,
              bindingName,
              filename,
              fallbackID,
              insertImport() {
                const {program} = state;
                program.node.body.unshift(
                  fallbackTranslationsImport({id: fallbackID}),
                );
              },
            });
          }
        }
      },
    },
  };
}

function getTranslations(filename: string): string[] {
  return glob.sync(
    path.resolve(path.dirname(filename), 'translations', '*.json'),
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
