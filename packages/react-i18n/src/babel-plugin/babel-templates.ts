import path from 'path';

import {TemplateBuilder} from '@babel/template';
import Types from '@babel/types';

import {TRANSLATION_DIRECTORY_NAME} from './constants';

export function fallbackTranslationsImport(
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>,
  {id, fallbackLocale},
) {
  return template(
    `import ${id} from './${TRANSLATION_DIRECTORY_NAME}/${fallbackLocale}.json';`,
    {
      sourceType: 'module',
    },
  )() as Types.ImportDeclaration;
}

export function translationsImport(
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>,
  {id},
) {
  return template(`import ${id} from './${TRANSLATION_DIRECTORY_NAME}';`, {
    sourceType: 'module',
  })() as Types.ImportDeclaration;
}

export function i18nCallExpression(
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>,
  {
    id,
    fallbackID,
    translationsArrayID,
    bindingName,
    translations,
    fallbackLocale,
  },
) {
  const translationArrayString = translationsArrayID
    ? translationsArrayID
    : `[${translations
        .filter(locale => !locale.endsWith(`${fallbackLocale}.json`))
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
            const dictionary = await import(/* webpackChunkName: "${id}-i18n", webpackMode: "lazy-once" */ \`./${TRANSLATION_DIRECTORY_NAME}/$\{locale}.json\`);
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
