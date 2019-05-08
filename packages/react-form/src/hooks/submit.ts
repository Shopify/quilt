import {useState, useCallback} from 'react';
import {useMountedRef} from '@shopify/react-hooks';
import {
  FormMapping,
  SubmitHandler,
  SubmitResult,
  FieldBag,
  FormError,
  FieldDictionary,
} from '../types';
import {mapObject, isField, propagateErrors, validateAll} from '../utilities';

export function useSubmit<T extends FieldBag>(
  onSubmit: SubmitHandler<FormMapping<T, 'value'>> = noopSubmission,
  fieldBag: T,
) {
  const mounted = useMountedRef();
  const [submitting, setSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState([] as FormError[]);
  const setErrors = useCallback(
    (errors: FormError[]) => {
      setSubmitErrors(errors);
      propagateErrors(fieldBag, errors);
    },
    [fieldBag],
  );

  async function submit(event?: React.FormEvent) {
    if (event && event.preventDefault && !event.defaultPrevented) {
      event.preventDefault();
    }

    const clientErrors = validateAll(fieldBag);
    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(getValues(fieldBag));

    if (mounted.current === false) {
      return;
    }

    setSubmitting(false);

    if (result.status === 'fail') {
      setErrors(result.errors);
    } else {
      setSubmitErrors([]);
    }
  }

  return {submit, submitting, errors: submitErrors, setErrors};
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
 * @param errors - An array of errors with the user's input. These can either include both a `field` and a `message`, in which case they will be passed down to a matching field, or just a `message`.
 * @return Returns a `SubmitResult` representing your failed form submission.
 */
export function submitFail(errors: FormError[] = []): SubmitResult {
  return {status: 'fail', errors};
}

function noopSubmission(_: unknown): Promise<SubmitResult> {
  return Promise.resolve(submitSuccess());
}
