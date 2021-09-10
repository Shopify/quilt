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
    withExplicitPaths,
  },
) {
  const localeIds = getLocaleIds({
    translationFilePaths,
    fallbackLocale,
  });

  const dictionaryRetriever = withExplicitPaths
    ? buildExplicitImports(id, localeIds)
    : `${generateLocaleReturnCheck(localeIds, translationArrayID)}
      return ${generateImportDefinition(id)}${generateThenChain(
        generateReturnDefaultFunction(),
      )};`;

  return template(
    `${bindingName}({
        id: '${id}',
        fallback: ${fallbackID},
        translations(locale) {
          ${dictionaryRetriever}
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

function buildExplicitImports(bindingId: string, localeIds: string[]) {
  if (localeIds.length === 0) {
    return `return;`;
  }

  if (localeIds.length === 1) {
    const localeId = localeIds[0];

    return `if (locale !== "${localeId}") {
      return;
    }

    return ${generateImportDefinition(bindingId, localeId)}${generateThenChain(
      generateReturnDefaultFunction(),
    )};`;
  }

  const returnDefaultVariable = 'returnDefault';
  const generateReturnStatement = (id: string) => {
    return `return ${generateImportDefinition(
      bindingId,
      id,
    )}${generateThenChain(returnDefaultVariable)};`;
  };

  const switchStatementInternals = localeIds.reduce((merged, value) => {
    return merged.concat(`case "${value}":
      ${generateReturnStatement(value)}
    `);
  }, '');

  const localeSelectionStatement = `switch (locale) {
    ${switchStatementInternals}
  }`;

  return `const ${returnDefaultVariable} = ${generateReturnDefaultFunction()};
  ${localeSelectionStatement}`;
}

function generateImportDefinition(
  bindingId: string,
  explicitFileName?: string,
) {
  if (explicitFileName) {
    return `import(/* webpackChunkName: "${bindingId}-i18n" */ "./${TRANSLATION_DIRECTORY_NAME}/${explicitFileName}.json")`;
  }

  return `import(/* webpackChunkName: "${bindingId}-i18n", webpackMode: "lazy-once" */ \`./${TRANSLATION_DIRECTORY_NAME}/\${locale}.json\`)`;
}

function generateLocaleReturnCheck(
  localeIds: string[],
  translationArrayID?: string,
) {
  const translationArrayString = translationArrayID
    ? translationArrayID
    : toArrayString(localeIds);

  return `if (${translationArrayString}.indexOf(locale) < 0) {
    return;
  }`;
}

function generateReturnDefaultFunction() {
  return '(dict) => dict && dict.default';
}

function generateThenChain(thenFunc: string) {
  return `.then(${thenFunc})`;
}
