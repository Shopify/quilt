import {useMemo} from 'react';
import {FieldDictionary, FieldOutput} from '../types';
import {isField} from '../utilities';

export function useDirty(fieldBag: {[key: string]: FieldOutput<any>}) {
  const fields = Object.values(fieldBag);

  return useMemo(
    () => {
      return fields.some(item => {
        if (isField(item)) {
          return item.dirty;
        }

        if (Array.isArray(item)) {
          return item.some(fieldsDirty);
        }

        return fieldsDirty(item);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...fields],
  );
}

function fieldsDirty(fields: FieldDictionary<any>) {
  return Object.keys(fields).some(key => {
    const field = fields[key];
    return field.dirty;
  });
}
