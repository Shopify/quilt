import path from 'path';

import stringHash from 'string-hash';

// based on postcss-modules implementation
// see https://github.com/css-modules/postcss-modules/blob/60920a97b165885683c41655e4ca594d15ec2aa0/src/generateScopedName.js
export function generateID(filePath: string) {
  const hash = stringHash(filePath)
    .toString(36)
    .substr(0, 5);
  const extension = path.extname(filePath);
  const legible = path.basename(filePath, extension);
  return `${legible}_${hash}`;
}
