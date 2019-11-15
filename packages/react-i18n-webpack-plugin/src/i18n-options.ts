import path from 'path';

import {camelCase} from 'change-case';

export function buildI18nOptions({
  id,
  chunkName,
  fallbackLocale,
  translationFiles,
}: {
  id: string;
  chunkName: string;
  fallbackLocale: string;
  translationFiles: string[];
}) {
  const fallBackExist = translationFiles.includes(`${fallbackLocale}.json`);

  const fallbackLocaleID = camelCase(fallbackLocale);
  const fallBackFileRelativePath = `./${fallbackLocale}.json`;

  const translations = translationFiles
    .filter(
      translationFile => !translationFile.endsWith(`${fallbackLocale}.json`),
    )
    .map(translationFile =>
      JSON.stringify(
        path.basename(translationFile, path.extname(translationFile)),
      ),
    )
    .sort()
    .join(', ');

  const importFallback = fallBackExist
    ? `import ${fallbackLocaleID} from '${fallBackFileRelativePath}';`
    : '';

  return `
    ${importFallback}
    export const i18nOptions = {
      id: '${id}',
      ${fallBackExist ? `fallback: ${fallbackLocaleID},` : ''}
      async translations(locale) {
        const translations = [${translations}];
        if (!translations.includes(locale)) {
          return;
        }
        const dictionary = await import(
          /* webpackChunkName: "${chunkName}", webpackMode: "lazy-once" */ \`./$\{locale}.json\`
        );
        return dictionary && dictionary.default;
        }
    }`;
}
