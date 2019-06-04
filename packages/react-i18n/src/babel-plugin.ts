import path from 'path';
import fs from 'fs';
import {TemplateBuilder} from '@babel/template';
import * as Types from '@babel/types';
import {NodePath} from '@babel/traverse';
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

  function i18nCallExpression({id, fallbackID, bindingName}) {
    return template(
      `${bindingName}({
        id: '${id}',
        fallback: ${fallbackID},
        async translations(locale) {
          const dictionary = await import(/* webpackChunkName: "${id}-i18n", webpackMode: "lazy-once" */ \`./translations/$\{locale}.json\`);
          return dictionary && dictionary.default;
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
      const parent: NodePath = referencePath.parentPath;
      return parent.isCallExpression() && parent.get('arguments').length === 0;
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

    if (!hasTranslations(filename)) {
      return;
    }

    insertImport();

    referencePathsToRewrite[0].parentPath.replaceWith(
      i18nCallExpression({
        id: generateID(filename),
        fallbackID,
        bindingName,
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

function hasTranslations(filename) {
  const enJSONPath = path.resolve(
    path.dirname(filename),
    'translations',
    'en.json',
  );
  return fs.existsSync(enJSONPath);
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
