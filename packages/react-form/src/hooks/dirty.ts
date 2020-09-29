import {FieldBag} from '../types';
import {reduceFields} from '../utilities';

export function useDirty(fieldBag: FieldBag) {
  return reduceFields(fieldBag, (dirty, field) => dirty || field.dirty, false);
}
