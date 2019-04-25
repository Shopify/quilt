import {FieldBag} from '../types';
import useVisitFields from './visitFields';

export function useReset(fieldBag: FieldBag) {
  return useVisitFields(fieldBag, field => field.reset());
}
