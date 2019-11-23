import path from 'path';

export const TRANSLATION_DIRECTORY_NAME = 'translations';
export const DEFAULT_FALLBACK_LOCALE = 'en';

export function getLocaleIds(options: {
  translationFilePaths: string[];
  fallbackLocale?: string;
}): string[] {
  const {
    translationFilePaths,
    fallbackLocale = DEFAULT_FALLBACK_LOCALE,
  } = options;

  return translationFilePaths
    .map(filePath => path.basename(filePath, path.extname(filePath)))
    .filter(locale => locale !== fallbackLocale)
    .sort();
}

export function toArrayString(stringArray: string[]) {
  return `[${stringArray
    .map(singleStr => JSON.stringify(singleStr))
    .join(', ')}]`;
}
