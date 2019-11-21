import path from 'path';

import glob from 'glob';
import stringHash from 'string-hash';

export function getTranslations(
  filename: string,
  translationDirName,
): string[] {
  return glob.sync(
    path.resolve(path.dirname(filename), translationDirName, '*.json'),
    {
      nodir: true,
    },
  );
}

// based on postcss-modules implementation
// see https://github.com/css-modules/postcss-modules/blob/60920a97b165885683c41655e4ca594d15ec2aa0/src/generateScopedName.js
export function generateID(filename: string) {
  const hash = stringHash(filename)
    .toString(36)
    .substr(0, 5);
  const extension = path.extname(filename);
  const legible = path.basename(filename, extension);
  return `${legible}_${hash}`;
}
