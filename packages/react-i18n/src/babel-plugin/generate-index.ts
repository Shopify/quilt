import {execSync} from 'child_process';
import {basename, dirname, join} from 'path';

import fs from 'fs-extra';

import {TRANSLATION_DIRECTORY_NAME} from './constants';

export function generateTranslationIndexes() {
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

    acc[translationsDir].push(basename(translationPath).replace('.json', ''));
    return acc;
  }, {});

  Object.entries(translationBuckets).forEach(
    ([translationsDir, localeIds]: [string, string[]]) => {
      const content =
        localeIds.length > 0
          ? `export default ['${localeIds.join("', '")}'];`
          : 'export default []';

      fs.writeFile(join(translationsDir, 'index.js'), content);
    },
  );
}
