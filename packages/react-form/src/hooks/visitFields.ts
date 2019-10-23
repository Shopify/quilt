import {useCallback, useRef} from 'react';
import {FieldDictionary, FieldOutput, Field} from '../types';
import {isField} from '../utilities';

interface FieldVisitor {
  (field: Field<any>): void;
}

export default function useVisitFields(
  fieldBag: {[key: string]: FieldOutput<any>},
  visitor: FieldVisitor,
) {
  const fieldBagRef = useRef(fieldBag);
  fieldBagRef.current = fieldBag;

  return useCallback(() => {
    const fields = Object.values(fieldBagRef.current);

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
  }, [visitor]);
}

function visitDictionary(visitor: FieldVisitor) {
  return (fields: FieldDictionary<any>) => {
    return Object.keys(fields).forEach(key => {
      const field = fields[key];
      visitor(field);
    });
  };
}
