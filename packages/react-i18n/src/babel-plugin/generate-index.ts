import {execSync} from 'child_process';
import {dirname, join} from 'path';

import fs from 'fs-extra';

import {
  TRANSLATION_DIRECTORY_NAME,
  DEFAULT_FALLBACK_LOCALE,
  getLocaleIds,
  toArrayString,
} from './shared';

export function generateTranslationIndexes() {
  const fallbackLocale = DEFAULT_FALLBACK_LOCALE;
  const translationBuckets = getTranslationBuckets();

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

export function generateTranslationDictionary(
  fallbackLocale: string,
  _includeLocaleIds?: string[],
) {
  const translationBuckets = getTranslationBuckets();

  Object.entries(translationBuckets).forEach(
    ([translationsDir, translationFilePaths]: [string, string[]]) => {
      const findFallbackFile = translationFilePaths.find(filePath =>
        filePath.endsWith(`${fallbackLocale}.json`),
      );

      if (!findFallbackFile) {
        return;
      }

      fs.readFile(findFallbackFile, (error, data) => {
        if (error) throw error;

        fs.writeFile(
          join(translationsDir, 'index.js'),
          `/* This is generated and should not be checked-in*/\nexport default {"${fallbackLocale}": ${data}};`,
        );
      });
    },
  );
}

function getTranslationBuckets() {
  // execSync is use here instead of Node's glob because it perform much faster
  // (20s vs 1s in web with ~750 translation folders and 21 langs)
  const files = execSync(
    `find . -type d \\( -path ./node_modules -o -path ./build -o -path ./tmp -o -path ./.git -o -path ./public \\) -prune -o -name '*.json' -print | grep /${TRANSLATION_DIRECTORY_NAME}/`,
  )
    .toString()
    .trim()
    .split('\n')
    .sort();

  return files.reduce((acc, translationPath) => {
    const translationsDir = dirname(translationPath);
    if (!acc[translationsDir]) {
      acc[translationsDir] = [];
    }

    acc[translationsDir].push(translationPath);
    return acc;
  }, {});
}
