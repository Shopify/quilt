import {useState, useCallback} from 'react';
import {
  FormMapping,
  SubmitHandler,
  SubmitResult,
  FieldBag,
  FormError,
  FieldDictionary,
} from '../types';
import {mapObject, isField} from '../utilities';

export function useSubmit<T extends FieldBag>(
  onSubmit: SubmitHandler<FormMapping<T, 'value'>> = noopSubmission,
  fieldBag: T,
) {
  const [submitting, setSubmitting] = useState(false);
  const [remoteErrors, setRemoteErrors] = useState([] as FormError[]);

  const submit = useCallback(
    async (event?: React.FormEvent) => {
      if (event && event.preventDefault && !event.defaultPrevented) {
        event.preventDefault();
      }

      setSubmitting(true);
      const result = await onSubmit(getValues(fieldBag));
      setSubmitting(false);

      if (result.status === 'fail') {
        setRemoteErrors(result.errors);
      } else {
        setRemoteErrors([]);
      }
    },
    [fieldBag, onSubmit],
  );

  return {submit, submitting, errors: remoteErrors, setErrors: setRemoteErrors};
}

function getValues<T extends FieldBag>(fieldBag: T) {
  return mapObject<FormMapping<T, 'value'>>(fieldBag, item => {
    if (isField(item)) {
      return item.value;
    }

    if (Array.isArray(item)) {
      return item.map(valuesOfFields);
    }

    return valuesOfFields(item);
  });
}

function valuesOfFields(fields: FieldDictionary<any>) {
  return mapObject(fields, item => {
    return item.value;
  });
}

/**
 * A convenience function for `onSubmit` callbacks returning values to `useSubmit` or `useForm`.
 * @return Returns a `SubmitResult` representing your successful form submission.
 */
export function submitSuccess(): SubmitResult {
  return {status: 'success'};
}

/**
 * A convenience function for `onSubmit` callbacks returning values to `useSubmit` or `useForm`
 * @param errors - An array of errors with the user's input. These can either include both a `fieldPath` and a `message`, in which case they will be passed down to a matching field, or just a `message`.
 * @return Returns a `SubmitResult` representing your failed form submission.
 */
export function submitFail(errors: FormError[] = []): SubmitResult {
  return {status: 'fail', errors};
}

function noopSubmission(_: unknown): Promise<SubmitResult> {
  return Promise.resolve(submitSuccess());
}
