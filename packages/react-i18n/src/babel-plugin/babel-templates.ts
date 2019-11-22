import {TemplateBuilder} from '@babel/template';
import Types from '@babel/types';

import {
  TRANSLATION_DIRECTORY_NAME,
  getLocaleIds,
  toArrayString,
} from './shared';

export function importModule(
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>,
  {id, from}: {id: string; from: string},
) {
  return template(`import ${id} from '${from}';`, {
    sourceType: 'module',
  })() as Types.ImportDeclaration;
}

export function i18nCallExpression(
  template: TemplateBuilder<Types.ImportDeclaration | Types.ObjectExpression>,
  {
    id,
    bindingName,
    translationFilePaths,
    fallback,
    translationIndexImportID,
    translationDictionaryImportID,
  }: {
    id: string;
    bindingName: string;
    translationFilePaths?: string[];
    fallback?: {
      locale: string;
      id: string;
    };
    translationIndexImportID?: string;
    translationDictionaryImportID?: string;
  },
) {
  let translationArrayString = '';
  if (translationDictionaryImportID) {
    translationArrayString = `Object.keys(${translationDictionaryImportID})`;
  } else if (translationIndexImportID) {
    translationArrayString = translationIndexImportID;
  } else if (translationFilePaths) {
    translationArrayString = toArrayString(
      getLocaleIds({
        translationFilePaths,
        fallbackLocale: fallback ? fallback.locale : undefined,
      }),
    );
  }

  return template(
    `${bindingName}({
        id: '${id}',
        ${fallback ? `fallback: ${fallback.id},` : ''}
        translations(locale) {
          if (${translationArrayString}.indexOf(locale) < 0) {
            return;
          }
          return ${
            translationDictionaryImportID
              ? `${translationDictionaryImportID}[locale]`
              : `(async () => {
            const dictionary = await import(/* webpackChunkName: "${id}-i18n", webpackMode: "lazy-once" */ \`./${TRANSLATION_DIRECTORY_NAME}/$\{locale}.json\`);
            return dictionary && dictionary.default;
          })()`
          };
        },
      })`,
    {
      sourceType: 'module',
      plugins: ['dynamicImport'],
      preserveComments: true,
    },
  )();
}
