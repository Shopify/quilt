import {useEffect} from 'react';
import get from 'get-value';

import {isField} from '../utilities';
import {FieldOutput, FormError} from '../types';

export function useErrorPropagation(
  fieldBag: {[key: string]: FieldOutput<any>},
  remoteErrors: FormError[],
) {
  useEffect(
    () => {
      remoteErrors.forEach(error => {
        if (error.fieldPath == null) {
          return;
        }

        const got = get(fieldBag, error.fieldPath);

        if (isField(got)) {
          got.setError(error.message);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [remoteErrors, ...Object.values(fieldBag)],
  );
}
