import {useCallback} from 'react';
import {FieldDictionary, FieldOutput, Field} from '../types';
import {isField} from '../utilities';

interface FieldVisitor {
  (field: Field<any>): void;
}

export default function useVisitFields(
  fieldBag: {[key: string]: FieldOutput<any>},
  visitor: FieldVisitor,
) {
  return useCallback(
    () => {
      const fields = Object.values(fieldBag);

      for (const item of fields) {
        if (isField(item)) {
          visitor(item);
          continue;
        }

        const visit = visitDictionary(visitor);
        if (Array.isArray(item)) {
          item.forEach(visit);
          continue;
        }

        visit(item);
      }
    },
    [fieldBag, visitor],
  );
}

function visitDictionary(visitor: FieldVisitor) {
  return (fields: FieldDictionary<any>) => {
    return Object.keys(fields).forEach(key => {
      const field = fields[key];
      visitor(field);
    });
  };
}
