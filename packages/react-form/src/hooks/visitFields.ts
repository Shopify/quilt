import {useCallback, useRef} from 'react';

import {FieldBag, Field} from '../types';
import {reduceFields} from '../utilities';

interface FieldVisitor {
  (field: Field<any>): void;
}

export default function useVisitFields(
  fieldBag: FieldBag,
  visitor: FieldVisitor,
) {
  const fieldBagRef = useRef(fieldBag);
  fieldBagRef.current = fieldBag;

  return useCallback(() => {
    reduceFields(fieldBagRef.current, (_, field) => visitor(field));
  }, [visitor]);
}
