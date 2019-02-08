import {TemplateBuilder} from '@babel/template';
import * as Types from '@babel/types';
import {NodePath} from '@babel/traverse';
import stringHash from 'string-hash';
import path from 'path';
import fs from 'fs';

interface State {
  lastImport: NodePath<Types.ImportDeclaration>;
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
    })();
  }
  function i18nParams({id, fallbackID, decoratorName}) {
    return template(
      `${decoratorName}({
      id: '${id}',
      fallback: ${fallbackID},
      async translations(locale) {
          try {
            const dictionary = await import(/* webpackChunkName: '${id}-i18n' */ \`./translations/$\{locale}.json\`);
            return dictionary;
          } catch (err) {}
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
    filenameRelative,
    lastImport,
  }) {
    if (!hasTranslations(filename)) {
      return;
    }

    let fallbackID;

    for (const refPath of binding.referencePaths) {
      const callExpression: NodePath = refPath.parentPath;

      if (!callExpression.isCallExpression()) {
        continue;
      }

      const args = callExpression.get('arguments');
      if (args.length !== 0) {
        continue;
      }

      if (fallbackID == null) {
        fallbackID = refPath.scope.generateUidIdentifier('en').name;
        lastImport.insertAfter(fallbackTranslationsImport({id: fallbackID}));
      }

      callExpression.replaceWith(
        i18nParams({
          id: generateID(filenameRelative),
          fallbackID,
          decoratorName: bindingName,
        }),
      );
    }
  }

  return {
    visitor: {
      Program(nodePath: NodePath<Types.Program>, state: State) {
        const lastImport = nodePath
          .get('body')
          .filter(subPath => subPath.isImportDeclaration())
          .pop();
        state.lastImport = lastImport as NodePath<Types.ImportDeclaration>;
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
            t.isImportSpecifier(specifier) &&
            specifier.imported.name === 'withI18n'
          ) {
            const bindingName = specifier.local.name;
            const binding = nodePath.scope.getBinding(bindingName);
            if (binding != null) {
              const {filename, filenameRelative} = this.file.opts;
              const {lastImport} = state;

              addI18nArguments({
                binding,
                bindingName,
                filename,
                filenameRelative,
                lastImport,
              });
            }
            break;
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
