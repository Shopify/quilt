import {resolve, sep} from 'path';

export const EXCLUDED_PACKAGES = [
  // This library is deprecated and will be removed.
  'rpc',
];

const rootDirectory = `${resolve(__dirname, '..')}${sep}`;
const regex = new RegExp(rootDirectory, 'g');
const lineNumberRegex = /(\.\w+):\d+:\d+/g;

export function stripFullFilePaths(value: any): any {
  if (value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(stripFullFilePaths);
  }

  if (typeof value === 'string') {
    return value.replace(regex, '').replace(lineNumberRegex, '$1');
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (value instanceof Error) {
    value.message = stripFullFilePaths(value.message);
    value.stack = stripFullFilePaths(value.stack);
    return value;
  }

  return Object.keys(value).reduce(
    (obj: object, key) => ({
      ...obj,
      [key]: stripFullFilePaths(value[key]),
    }),
    {},
  );
}
