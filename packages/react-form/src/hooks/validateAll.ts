import {useCallback} from 'react';
import {FieldDictionary, FieldOutput, FormError, Field} from '../types';
import {isField} from '../utilities';

export function useValidateAll(fieldBag: {[key: string]: FieldOutput<any>}) {
  return useCallback(
    () => {
      const fields = Object.values(fieldBag);
      const errors: FormError[] = [];

      function validate(field: Field<unknown>) {
        const message = field.runValidation();
        if (message) {
          errors.push({message});
        }
      }

      function validateDictionary(fields: FieldDictionary<any>) {
        Object.values(fields).forEach(validate);
      }

      for (const item of fields) {
        if (isField(item)) {
          validate(item);
        } else if (Array.isArray(item)) {
          item.map(validateDictionary);
        } else {
          validateDictionary(item);
        }
      }

      return errors;
    },
    [fieldBag],
  );
}
