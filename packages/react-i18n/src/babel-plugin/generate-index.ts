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

  // `find` is used here instead of Node's glob because it performs much faster
  // (20s vs 1s in web with ~750 translation folders and 21 langs)
  const files = execSync(
    `find . -type d \\( -path ./node_modules -o -path ./build -o -path ./tmp -o -path ./.git -o -path ./public \\) -prune -o -name '*.json' -print | grep /${TRANSLATION_DIRECTORY_NAME}/`,
  )
    .toString()
    .trim()
    .split('\n')
    .sort();

  const translationBuckets = files.reduce((acc, translationPath) => {
    const translationsDir = dirname(translationPath);
    if (!acc[translationsDir]) {
      acc[translationsDir] = [];
    }

    acc[translationsDir].push(translationPath);
    return acc;
  }, {});

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
