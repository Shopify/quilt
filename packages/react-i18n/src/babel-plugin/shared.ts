import path from 'path';

export const TRANSLATION_DIRECTORY_NAME = 'translations';
export const DEFAULT_FALLBACK_LOCALE = 'en';

export function getLocaleIds(options: {
  translationFilePaths: string[];
  fallbackLocale?: string;
  includeLocaleIds?: string[];
}): string[] {
  const {
    translationFilePaths,
    fallbackLocale = DEFAULT_FALLBACK_LOCALE,
    includeLocaleIds,
  } = options;

  return translationFilePaths
    .map(filePath => path.basename(filePath, path.extname(filePath)))
    .filter(
      locale =>
        (fallbackLocale ? locale !== fallbackLocale : true) &&
        (includeLocaleIds ? includeLocaleIds.includes(locale) : true),
    )
    .sort();
}

export function toArrayString(stringArray: string[]) {
  return `[${stringArray
    .map(singleStr => JSON.stringify(singleStr))
    .join(', ')}]`;
}
