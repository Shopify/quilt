import {join} from 'path';

import fs from 'fs-extra';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';

import {DEFAULT_FALLBACK_LOCALE, findTranslationBuckets} from './shared';

export interface Options {
  fallbackLocale: string;
  rootDir: string;
}

export async function generateTranslationDictionaries(
  locales: string[],
  {
    fallbackLocale = DEFAULT_FALLBACK_LOCALE,
    rootDir = process.cwd(),
  }: Partial<Options> = {},
) {
  if (!locales || locales.length === 0) {
    throw new Error(
      'generateTranslationDictionary must be called with at least one locale.',
    );
  }

  const translationBuckets = findTranslationBuckets(rootDir);

  await Promise.all(
    Object.entries(translationBuckets).map(
      async ([translationsDir, translationFilePaths]) => {
        const fallbackTranslations = await readLocaleTranslations(
          fallbackLocale,
          translationFilePaths,
        );

        const dictionary = await locales.reduce(async (accPromise, locale) => {
          const localeTranslations = await readLocaleTranslations(
            locale,
            translationFilePaths,
          );
          const acc = await accPromise;
          acc[locale] = merge(
            cloneDeep(fallbackTranslations),
            localeTranslations,
          );
          return acc;
        }, {});

        const contentStr = JSON.stringify(dictionary);

        // Writing the content out as a JSON.parse-wrapped string seems
        // counter-intuitive, but browsers can parse this faster than they
        // can parse JavaScript ‾\_(ツ)_/‾
        // https://www.youtube.com/watch?v=ff4fgQxPaO0
        await fs.writeFile(
          join(translationsDir, 'index.js'),
          `export default JSON.parse(${JSON.stringify(contentStr)})`,
        );
      },
    ),
  );
}

async function readLocaleTranslations(
  locale: string,
  translationFilePaths: string[],
) {
  const translationPath = translationFilePaths.find(filePath =>
    filePath.endsWith(`/${locale}.json`),
  );

  return translationPath ? fs.readJson(translationPath) : {};
}
