import {TemplateBuilder} from '@babel/template';
import Types from '@babel/types';

import {
  TRANSLATION_DIRECTORY_NAME,
  getLocaleIds,
  toArrayString,
} from './shared';

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
    translationArrayID,
    bindingName,
    translationFilePaths,
    fallbackLocale,
  },
) {
  const translationArrayString = translationArrayID
    ? translationArrayID
    : toArrayString(
        getLocaleIds({
          translationFilePaths,
          fallbackLocale,
        }),
      );

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

export function i18nGeneratedDictionaryCallExpression(
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>,
  {id, translationsID, bindingName},
) {
  return template(
    `${bindingName}({
        id: '${id}',
        fallback: Object.values(${translationsID})[0],
        translations(locale) {
          return Promise.resolve(${translationsID}[locale]);
        },
      })`,
    {
      sourceType: 'module',
      plugins: ['dynamicImport'],
      preserveComments: true,
    },
  )();
}
