import path from 'path';

import {TemplateBuilder} from '@babel/template';
import Types from '@babel/types';

export function fallbackTranslationsImport(
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>,
  {id, translationDirName, fallbackLocale},
) {
  return template(
    `import ${id} from './${translationDirName}/${fallbackLocale}.json';`,
    {
      sourceType: 'module',
    },
  )() as Types.ImportDeclaration;
}

export function translationsImport(
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>,
  {id, translationDirName},
) {
  return template(`import ${id} from './${translationDirName}';`, {
    sourceType: 'module',
  })() as Types.ImportDeclaration;
}

export function i18nCallExpression(
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>,
  {
    id,
    fallbackID,
    translationID,
    bindingName,
    translations,
    translationDirName,
  },
) {
  const translationArrayString = translationID
    ? translationID
    : `[${translations
        .filter(locale => !locale.endsWith('en.json'))
        .map(locale =>
          JSON.stringify(path.basename(locale, path.extname(locale))),
        )
        .sort()
        .join(', ')}]`;

  return template(
    `${bindingName}({
        id: '${id}',
        fallback: ${fallbackID},
        translations(locale) {
          if (${translationArrayString}.indexOf(locale) < 0) {
            return;
          }
          return (async () => {
            const dictionary = await import(/* webpackChunkName: "${id}-i18n", webpackMode: "lazy-once" */ \`./${translationDirName}/$\{locale}.json\`);
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
