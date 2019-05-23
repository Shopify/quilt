import {FieldBag, Field} from '../types';
import useVisitFields from './visitFields';

export function useReset(fieldBag: FieldBag) {
  return useVisitFields(fieldBag, resetField);
}

function resetField(field: Field<unknown>) {
  field.reset();
}
