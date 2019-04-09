import isPlainObject from 'lodash/isPlainObject';

export function objectToKey<T extends Record<string, any>>(obj: T): T | string {
  if (!isPlainObject(obj)) {
    return obj;
  }
  const sortedObj = Object.keys(obj)
    .sort()
    .reduce((result: Record<string, any>, key) => {
      result[key] = objectToKey(obj[key]);
      return result;
    }, {});
  return JSON.stringify(sortedObj);
}

export function compact(obj: any) {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (obj[key] !== undefined) {
        acc[key] = obj[key];
      }

      return acc;
    },
    {} as any,
  );
}
