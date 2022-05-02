import {SchemaNode} from '../types';

export const toNumber = (val: any) => Number(val) || 0;
export const toString = (val: any) => `${val ? val : ''}`;
export const toBoolean = (val: any) => Boolean(val);

const mapByKind = {
  number: toNumber,
  integer: toNumber,
  string: toString,
  boolean: toBoolean,
};

export function defaultTypeFormater(val: any, type: string, _node: SchemaNode) {
  // the backend could intentionnaly send null values
  // these are not to be formatted as it allows differencing
  // between undefined and nil
  if (val === null) return val;
  const transform = mapByKind[type as keyof typeof mapByKind];
  return transform ? transform(val) : val;
}
