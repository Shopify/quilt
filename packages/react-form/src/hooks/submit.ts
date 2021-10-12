import {useState, useCallback} from 'react';
import {useLazyRef, useMountedRef} from '@shopify/react-hooks';

import {
  FormMapping,
  SubmitHandler,
  SubmitResult,
  FieldBag,
  FormError,
  DynamicListBag,
} from '../types';
import {
  propagateErrors,
  validateAll,
  getValues,
  makeCleanFields,
  makeCleanDynamicLists,
} from '../utilities';

export function useSubmit<T extends FieldBag>(
  onSubmit: SubmitHandler<FormMapping<T, 'value'>> = noopSubmission,
  fieldBag: T,
  makeCleanAfterSubmit = false,
  dynamicListBag?: DynamicListBag,
) {
  const mounted = useMountedRef();
  const [submitting, setSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState([] as FormError[]);

  const fieldBagRef = useLazyRef(() => fieldBag);
  fieldBagRef.current = fieldBag;
  const dynamicListBagRef = useLazyRef(() => dynamicListBag);

  const setErrors = useCallback(
    (errors: FormError[]) => {
      setSubmitErrors(errors);
      propagateErrors(fieldBagRef.current, errors);
    },
    [fieldBagRef],
  );

  const submit = useCallback(
    async (event?: React.FormEvent) => {
      const fields = fieldBagRef.current;
      const dynamicLists = dynamicListBagRef.current;
      if (event && event.preventDefault && !event.defaultPrevented) {
        event.preventDefault();
      }

      const clientErrors = validateAll(fields);
      if (clientErrors.length > 0) {
        setErrors(clientErrors);
        return;
      }

      setSubmitting(true);
      const result = await onSubmit(getValues(fields));

      if (mounted.current === false) {
        return;
      }

      setSubmitting(false);

      if (result.status === 'fail') {
        setErrors(result.errors);
      } else {
        setSubmitErrors([]);
        if (makeCleanAfterSubmit) {
          makeCleanFields(fields);
          makeCleanDynamicLists(dynamicLists);
        }
      }
    },
    [
      fieldBagRef,
      dynamicListBagRef,
      onSubmit,
      mounted,
      setErrors,
      makeCleanAfterSubmit,
    ],
  );

  return {submit, submitting, errors: submitErrors, setErrors};
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
