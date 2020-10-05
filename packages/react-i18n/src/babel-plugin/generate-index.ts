import {join} from 'path';

import fs from 'fs-extra';

import {
  DEFAULT_FALLBACK_LOCALE,
  findTranslationBuckets,
  getLocaleIds,
  toArrayString,
} from './shared';

export interface Options {
  fallbackLocale: string;
  rootDir: string;
}

export function generateTranslationIndexes() {
  const fallbackLocale = DEFAULT_FALLBACK_LOCALE;
  const translationBuckets = findTranslationBuckets(process.cwd());

  Object.entries(translationBuckets).forEach(
    ([translationsDir, translationFilePaths]: [string, string[]]) => {
      const localeIdArrayString = toArrayString(
        getLocaleIds({
          translationFilePaths,
          fallbackLocale,
        }),
      );

      fs.writeFile(
        join(translationsDir, 'index.js'),
        `/* This is generated and should not be checked-in*/\nexport default ${localeIdArrayString};`,
      );
    },
  );
}
