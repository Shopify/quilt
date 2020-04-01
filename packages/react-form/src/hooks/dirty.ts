import {useMemo} from 'react';

import {FieldBag} from '../types';
import {fieldsToArray} from '../utilities';

export function useDirty(fieldBag: FieldBag) {
  const fields = fieldsToArray(fieldBag);

  return useMemo(
    () => fields.some(field => field.dirty),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fields,
  );
}
