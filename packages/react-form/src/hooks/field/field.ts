import {useCallback, useEffect, useMemo, ChangeEvent} from 'react';
import isEqual from 'fast-deep-equal';

import {Validates, Field, DirtyStateComparator} from '../../types';
import {normalizeValidation, isChangeEvent} from '../../utilities';

import {
  updateAction,
  updateErrorAction,
  newDefaultAction,
  resetAction,
  useFieldReducer,
} from './reducer';

export interface FieldConfig<Value> {
  value: Value;
  validates: Validates<Value>;
  dirtyStateComparator?: DirtyStateComparator<Value>;
}

/**
 * A custom hook for handling the state and validations of an input field.
 *
 * In it's simplest form `useField` can be called with a single parameter for the default value of the field.
 *
 * ```typescript
 * const field = useField('default value');
 * ```
 *
 * You can also pass a more complex configuration object specifying a validation function.
 *
 *
 * ```typescript
 *const field = useField({
 *  value: someRemoteData.title,
 *  validates: (title) => {
 *    if (title.length > 3) {
 *      return 'Title must be longer than three characters';
 *    }
 *  }
 *});
 * ```
 *
 * You may also pass multiple validators.
 *
 *```typescript
 * const field = useField({
 *   value: someRemoteData.title,
 *   validates: [
 *      (title) => {
 *         if (title.length > 3) {
 *           return 'Title must be longer than three characters';
 *         }
 *      },
 *      (title) => {
 *         if (!title.includes('radical')) {
 *           return 'only radical items allowed!';
 *         }
 *       }
 *    ],
 * });
 * ```
 *
 * Generally, you will want to use the object returned from useField to handle state for exactly one form input.
 *
 * ```typescript
 * const field = useField('default value');
 * return (
 *   <div>
 *     <label htmlFor="test-field">
 *       Test field{' '}
 *       <input
 *         id="test-field"
 *         name="test-field"
 *         value={field.value}
 *         onChange={field.onChange}
 *         onBlur={field.onBlur}
 *       />
 *     </label>
 *     {field.error && <p>{field.error}</p>}
 *   </div>
 * );
 * ```
 *
 * If using `@shopify/polaris` or other custom components that support `onChange`, `onBlur`, `value`, and `error` props then
 * you can accomplish the above more tersely by using the ES6 `spread` (...) operator.
 *
 * ```typescript
 * const title = useField('default title');
 * return (<TextField label="Title" {...title} />);
 * ```
 *
 * @param config - The default value of the input, or a configuration object specifying both the value and validation config.
 * @param validationDependencies - An array of values for determining when to regenerate the field's validation callbacks. Any value that is referenced by a validator other than those passed into it should be included.
 * @returns A `Field` object representing the state of your input. It also includes functions to manipulate that state. Generally, you will want to pass these callbacks down to the component or components representing your input.
 *
 * @remarks
 * **Reinitialization:** If the `value` property of the field configuration changes between calls to `useField`,
 * the field will be reset to use it as it's new default value.
 *
 * **Imperative methods:** The returned `Field` object contains a number of methods used to imperatively alter its state.
 * These should only be used as escape hatches where the existing hooks and components do not make your life easy,
 * or to build new abstractions in the same vein as `useForm`, `useSubmit` and friends.
 */
export function useField<Value = string>(
  input: FieldConfig<Value> | Value,
  dependencies: unknown[] = [],
): Field<Value> {
  const {value, validates, dirtyStateComparator} = normalizeFieldConfig(input);
  const validators = normalizeValidation(validates);

  const [state, dispatch] = useFieldReducer(value, dirtyStateComparator);

  const resetActionObject = useMemo(() => resetAction(), []);
  const reset = useCallback(() => dispatch(resetActionObject), [
    dispatch,
    resetActionObject,
  ]);
  const newDefaultValue = useCallback(
    value => dispatch(newDefaultAction(value)),
    [dispatch],
  );

  const runValidation = useCallback(
    (value: Value = state.value) => {
      const errors = validators
        .map(check => check(value, {}))
        .filter(value => value != null);

      if (errors && errors.length > 0) {
        const [firstError] = errors;
        dispatch(updateErrorAction(errors));
        return firstError;
      }

      dispatch(updateErrorAction(undefined));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.value, ...dependencies],
  );

  const onChange = useCallback(
    (value: Value | ChangeEvent) => {
      const normalizedValue = isChangeEvent(value) ? value.target.value : value;

      dispatch(updateAction(normalizedValue) as any);

      if (state.error) {
        runValidation(normalizedValue as Value);
      }
    },
    [runValidation, state.error, dispatch],
  );

  const setError = useCallback(value => dispatch(updateErrorAction(value)), [
    dispatch,
  ]);

  const onBlur = useCallback(() => {
    if (state.touched === false && state.error == null) {
      return;
    }

    runValidation();
  }, [runValidation, state.touched, state.error]);

  // We want to reset the field whenever a new `value` is passed in
  useEffect(() => {
    if (!isEqual(value, state.defaultValue)) {
      newDefaultValue(value);
    }
    // We actually do not want this to rerun when our `defaultValue` is updated. It can
    // only happen independently of this callback when `newDefaultValue` is called by a user,
    // and we don't want to undue their hard work by resetting to `value`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, newDefaultValue]);

  const field = useMemo(() => {
    return {
      ...state,
      onBlur,
      onChange,
      newDefaultValue,
      runValidation,
      setError,
      reset,
    };
  }, [
    state,
    onBlur,
    onChange,
    newDefaultValue,
    runValidation,
    setError,
    reset,
  ]);

  return field as Field<Value>;
}

/**
 * Converts a standard `Field<boolean>` into a `ChoiceField` that is compatible
 * with `<Checkbox />` and `<RadioButton />` components in `@shopify/polaris`.
 *
 * For fields that are used by both a choice components and other components, it
 * can be beneficial to retain the original `Field<boolean>` shape and convert
 * the field on the fly for the choice component.
 *
 * ```typescript
 * const enabled = useField(false);
 * return (<Checkbox label="Enabled" {...asChoiceField(enabled)} />);
 * ```
 */
export function asChoiceField({value: checked, ...fieldData}: Field<boolean>) {
  return {
    checked,
    ...fieldData,
  };
}

export type ChoiceField = ReturnType<typeof asChoiceField>;

/**
 * A simplification to `useField` that returns a `ChoiceField` by automatically
 * converting the field using `asChoiceField` for direct use in choice
 * components.
 *
 * ```typescript
 * const enabled = useChoiceField(false);
 * return (<Checkbox label="Enabled" {...enabled} />);
 * ```
 */
export function useChoiceField(
  input: FieldConfig<boolean> | boolean,
  dependencies: unknown[] = [],
) {
  return asChoiceField(useField(input, dependencies));
}

function normalizeFieldConfig<Value>(
  input: FieldConfig<Value> | Value,
): FieldConfig<Value> {
  if (isFieldConfig(input)) {
    return input;
  }

  return {value: input, validates: () => undefined};
}

function isFieldConfig<Value>(input: unknown): input is FieldConfig<Value> {
  return (
    input != null &&
    typeof input === 'object' &&
    Reflect.has(input as object, 'value') &&
    Reflect.has(input as object, 'validates')
  );
}
