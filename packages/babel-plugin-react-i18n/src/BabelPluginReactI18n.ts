import {TemplateBuilder} from '@babel/template';
import * as Types from '@babel/types';
import {NodePath} from '@babel/traverse';
import stringHash from 'string-hash';
import path from 'path';
import fs from 'fs';

interface State {
  lastKnownImport: NodePath<Types.ImportDeclaration>;
  decoratorName?: string;
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

  return {
    visitor: {
      ImportDeclaration(
        nodePath: NodePath<Types.ImportDeclaration>,
        state: State,
      ) {
        state.lastKnownImport = nodePath;
        if (nodePath.node.source.value !== '@shopify/react-i18n') {
          return;
        }
        const {specifiers} = nodePath.node;
        for (const specifier of specifiers) {
          if (
            t.isImportSpecifier(specifier) &&
            specifier.imported.name === 'withI18n'
          ) {
            state.decoratorName = specifier.local.name;
            break;
          }
        }
      },
      CallExpression(nodePath: NodePath<Types.CallExpression>, state: State) {
        const expr = nodePath.node;
        const {callee} = expr;
        if (
          t.isIdentifier(callee) &&
          callee.name === state.decoratorName &&
          expr.arguments.length === 0
        ) {
          const {filename, filenameRelative} = this.file.opts;
          const enJSONPath = path.resolve(
            path.dirname(filename),
            'translations',
            'en.json',
          );
          if (!fs.existsSync(enJSONPath)) {
            return;
          }
          const fallbackID = nodePath.scope.generateUidIdentifier('en').name;
          state.lastKnownImport.insertAfter(
            fallbackTranslationsImport({
              id: fallbackID,
            }),
          );
          nodePath.replaceWith(
            i18nParams({
              id: generateID(filenameRelative),
              fallbackID,
              decoratorName: state.decoratorName,
            }),
          );
        }
      },
    },
  };
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
