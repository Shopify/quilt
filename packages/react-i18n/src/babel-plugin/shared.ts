import {execSync} from 'child_process';
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

export function findTranslationBuckets(rootDir) {
  // `find` is used here instead of Node's glob because it performs much faster
  // (20s vs 1s in web with ~750 translation folders and 21 langs)
  const files = execSync(
    `find ${rootDir} -type d \\( -path ./node_modules -o -path ./build -o -path ./tmp -o -path ./.git -o -path ./public \\) -prune -o -name '*.json' -print | grep /${TRANSLATION_DIRECTORY_NAME}/`,
  )
    .toString()
    .trim()
    .split('\n')
    .sort();

  return files.reduce((acc, translationPath) => {
    const translationsDir = path.dirname(translationPath);
    if (!acc[translationsDir]) {
      acc[translationsDir] = [];
    }

    acc[translationsDir].push(translationPath);
    return acc;
  }, {} as {[key: string]: string[]});
}
