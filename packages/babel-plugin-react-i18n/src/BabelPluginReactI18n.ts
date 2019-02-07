import {TemplateBuilder} from '@babel/template';
import * as Types from '@babel/types';
import {NodePath} from '@babel/traverse';
import stringHash from 'string-hash';
import path from 'path';
import fs from 'fs';

interface State {
  importer(importArg: Types.ImportDeclaration): void;
}

const WITH_I18N_DECORATOR_NAME = 'withI18n';

export default function injectWithI18nArguments({
  types: t,
  template,
}: {
  types: typeof Types;
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>;
}) {
  const fallbackTranslationsImport = template(
    `import enTranslations from './translations/en.json';`,
    {sourceType: 'module'},
  );
  function i18nParams({ID}) {
    return template(
      `withI18n({
      id: '${ID}',
      fallback: enTranslations,
      async translations(locale) {
          try {
            const dictionary = await import(/* webpackChunkName: '${ID}-i18n' */ \`./translations/$\{locale}.json\`);
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
      Program(_path: NodePath<Types.Program>, state: State) {
        const lastImport = _path
          .get('body')
          .filter(subPath => subPath.isImportDeclaration())
          .pop();
        if (lastImport) {
          state.importer = importDecl => lastImport.insertAfter(importDecl);
        } else {
          state.importer = importDecl =>
            _path.get('body')[0].insertBefore(importDecl);
        }
      },
      CallExpression(_path: NodePath<Types.CallExpression>, state: State) {
        const expr = _path.node;
        const {callee} = expr;
        if (
          t.isIdentifier(callee) &&
          (callee as Types.Identifier).name === WITH_I18N_DECORATOR_NAME &&
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
          state.importer(
            fallbackTranslationsImport() as Types.ImportDeclaration,
          );
          _path.replaceWith(i18nParams({
            ID: generateID(filenameRelative),
          }) as Types.ObjectExpression);
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
  const legible = path.basename(filename).replace(extension, '');
  return `${legible}_${hash}`;
}
