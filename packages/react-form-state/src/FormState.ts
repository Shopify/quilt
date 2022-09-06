/* eslint-disable no-case-declarations */
import React from 'react';

import {mapObject, set, isEqual, flatMap} from './utilities';
import {
  FieldDescriptors,
  FieldState,
  ValueMapper,
  FieldStates,
  ValidationFunction,
} from './types';
import {List, Nested} from './components';

export interface RemoteError {
  field?: string[] | null;
  message: string;
}

type MaybeArray<T> = T | T[];
type MaybePromise<T> = T | Promise<T>;

interface SubmitHandler<Fields> {
  (formDetails: FormData<Fields>):
    | MaybePromise<RemoteError[]>
    | MaybePromise<void>
    | MaybePromise<RemoteError[] | void>;
}

export type Validator<T, F> = MaybeArray<ValidationFunction<T, F>>;

export type ValidatorDictionary<FieldMap> = {
  [FieldPath in keyof FieldMap]: Validator<FieldMap[FieldPath], FieldMap>;
};

export interface FormData<Fields> {
  fields: FieldDescriptors<Fields>;
  dirty: boolean;
  valid: boolean;
  errors: RemoteError[];
}

export interface FormDetails<Fields> extends FormData<Fields> {
  submitting: boolean;
  reset(): void;
  submit(): void;
}

interface Props<Fields> {
  initialValues: Fields;
  children(form: FormDetails<Fields>): React.ReactNode;
  validators?: Partial<ValidatorDictionary<Fields>>;
  onSubmit?: SubmitHandler<Fields>;
  validateOnSubmit?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onInitialValuesChange?: 'reset-all' | 'reset-where-changed' | 'ignore';
  externalErrors?: RemoteError[];
}

interface State<Fields> {
  submitting: boolean;
  fields: FieldStates<Fields>;
  dirtyFields: (keyof Fields)[];
  errors: RemoteError[];
  externalErrors: RemoteError[];
}

export default class FormState<
  Fields extends object,
> extends React.PureComponent<Props<Fields>, State<Fields>> {
  static List = List;
  static Nested = Nested;

  static getDerivedStateFromProps<T extends object>(
    newProps: Props<T>,
    oldState: State<T>,
  ) {
    const {
      initialValues,
      onInitialValuesChange,
      externalErrors = [],
    } = newProps;

    const externalErrorsChanged = !isEqual(
      externalErrors,
      oldState.externalErrors,
    );

    const updatedExternalErrors = externalErrorsChanged
      ? {
          externalErrors,
          fields: fieldsWithErrors(oldState.fields, [
            ...externalErrors,
            ...oldState.errors,
          ]),
        }
      : null;

    switch (onInitialValuesChange) {
      case 'ignore':
        return updatedExternalErrors;
      case 'reset-where-changed':
        return reconcileFormState(initialValues, oldState, externalErrors);
      case 'reset-all':
      default:
        const oldInitialValues = initialValuesFromFields(oldState.fields);
        const valuesMatch = isEqual(oldInitialValues, initialValues);

        if (valuesMatch) {
          return updatedExternalErrors;
        }

        return createFormState(initialValues, externalErrors);
    }
  }

  state: State<Fields> = createFormState(
    this.props.initialValues,
    this.props.externalErrors,
  );

  private mounted = false;
  private fieldsWithHandlers = new WeakMap();

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {children} = this.props;
    const {submitting} = this.state;
    const {submit, reset, formData} = this;

    return children({
      ...formData,
      submit,
      reset,
      submitting,
    });
  }

  // eslint-disable-next-line @shopify/react-prefer-private-members
  public validateForm() {
    return new Promise<void>((resolve) => {
      this.setState(runAllValidators, () => resolve());
    });
  }

  // eslint-disable-next-line @shopify/react-prefer-private-members
  public reset = () => {
    return new Promise<void>((resolve) => {
      this.setState(
        (_state, props) =>
          createFormState(props.initialValues, props.externalErrors),
        () => resolve(),
      );
    });
  };

  private get formData() {
    const {errors} = this.state;
    const {externalErrors = []} = this.props;
    const {fields, dirty, valid} = this;

    return {
      dirty,
      valid,
      errors: [...errors, ...externalErrors],
      fields,
    };
  }

  private get dirty() {
    return this.state.dirtyFields.length > 0;
  }

  private get valid() {
    const {errors, externalErrors} = this.state;

    return (
      !this.hasClientErrors &&
      errors.length === 0 &&
      externalErrors.length === 0
    );
  }

  private get hasClientErrors() {
    const {fields} = this.state;

    return Object.keys(fields).some((fieldPath) => {
      const field = fields[fieldPath];
      return field.error != null;
    });
  }

  private get clientErrors() {
    const {fields} = this.state;

    return flatMap(Object.values(fields), ({error}) => collectErrors(error));
  }

  private get fields() {
    const {fields} = this.state;
    const fieldDescriptors: FieldDescriptors<Fields> = mapObject(
      fields,
      this.fieldWithHandlers,
    );

    return fieldDescriptors;
  }

  private submit = async (event?: Event) => {
    const {onSubmit, validateOnSubmit} = this.props;
    const {formData} = this;

    if (!this.mounted) {
      return;
    }

    if (event && event.preventDefault && !event.defaultPrevented) {
      event.preventDefault();
    }

    if (onSubmit == null) {
      return;
    }

    this.setState({submitting: true});

    if (validateOnSubmit) {
      await this.validateForm();

      const clientErrors = this.clientErrors;

      if (clientErrors.length > 0) {
        this.setState({submitting: false, errors: clientErrors});
        return;
      }
    }

    const errors = (await onSubmit(formData)) || [];

    if (!this.mounted) {
      return;
    }

    if (errors.length > 0) {
      this.updateRemoteErrors(errors);
      this.setState({submitting: false});
    } else {
      this.setState({submitting: false, errors});
    }
  };

  private fieldWithHandlers = <Key extends keyof Fields>(
    field: FieldStates<Fields>[Key],
    fieldPath: Key,
  ) => {
    if (this.fieldsWithHandlers.has(field)) {
      return this.fieldsWithHandlers.get(field);
    }

    const result = {
      ...(field as FieldState<Fields[Key]>),
      name: String(fieldPath),
      onChange: this.updateField.bind(this, fieldPath),
      onBlur: this.blurField.bind(this, fieldPath),
    };
    this.fieldsWithHandlers.set(field, result);
    return result;
  };

  private updateField<Key extends keyof Fields>(
    fieldPath: Key,
    value: Fields[Key] | ValueMapper<Fields[Key]>,
  ) {
    this.setState<any>(({fields, dirtyFields}: State<Fields>) => {
      const field = fields[fieldPath];

      const newValue =
        typeof value === 'function'
          ? (value as ValueMapper<Fields[Key]>)(field.value)
          : value;

      const dirty = !isEqual(newValue, field.initialValue);

      const updatedField = this.getUpdatedField({
        fieldPath,
        field,
        value: newValue,
        dirty,
      });

      return {
        dirtyFields: this.getUpdatedDirtyFields({
          fieldPath,
          dirty,
          dirtyFields,
        }),
        fields:
          updatedField === field
            ? fields
            : {
                // FieldStates<Fields> is not spreadable due to a TS bug
                // https://github.com/Microsoft/TypeScript/issues/13557
                ...(fields as any),
                [fieldPath]: updatedField,
              },
      };
    });
  }

  private getUpdatedDirtyFields<Key extends keyof Fields>({
    fieldPath,
    dirty,
    dirtyFields,
  }: {
    fieldPath: Key;
    dirty: boolean;
    dirtyFields: (keyof Fields)[];
  }) {
    const dirtyFieldsSet = new Set(dirtyFields);

    if (dirty) {
      dirtyFieldsSet.add(fieldPath);
    } else {
      dirtyFieldsSet.delete(fieldPath);
    }

    const newDirtyFields = Array.from(dirtyFieldsSet);

    return dirtyFields.length === newDirtyFields.length
      ? dirtyFields
      : newDirtyFields;
  }

  private getUpdatedField<Key extends keyof Fields>({
    fieldPath,
    field,
    value,
    dirty,
  }: {
    fieldPath: Key;
    field: FieldStates<Fields>[Key];
    value: Fields[Key];
    dirty: boolean;
  }) {
    // We only want to update errors as the user types if they already have an error.
    // https://polaris.shopify.com/patterns/error-messages#section-form-validation
    const skipValidation = field.error == null;
    const error = skipValidation
      ? field.error
      : this.validateFieldValue(fieldPath, {value, dirty});

    if (value === field.value && error === field.error) {
      return field;
    }

    return {
      ...(field as FieldState<Fields[Key]>),
      value,
      dirty,
      error,
    };
  }

  private blurField<Key extends keyof Fields>(fieldPath: Key) {
    const {fields} = this.state;
    const field = fields[fieldPath];
    const error = this.validateFieldValue<Key>(fieldPath, field);

    if (error == null) {
      return;
    }

    this.setState((state) => ({
      fields: {
        // FieldStates<Fields> is not spreadable due to a TS bug
        // https://github.com/Microsoft/TypeScript/issues/13557
        ...(state.fields as any),
        [fieldPath]: {
          ...(state.fields[fieldPath] as FieldState<Fields[Key]>),
          error,
        },
      },
    }));
  }

  private validateFieldValue<Key extends keyof Fields>(
    fieldPath: Key,
    {value, dirty}: Pick<FieldState<Fields[Key]>, 'value' | 'dirty'>,
  ) {
    if (!dirty) {
      return;
    }

    const {validators = {} as Partial<ValidatorDictionary<Fields>>} =
      this.props;
    const {fields} = this.state;

    return runValidator(validators[fieldPath], value, fields);
  }

  private updateRemoteErrors(errors: RemoteError[]) {
    this.setState(({fields, externalErrors}) => ({
      errors,
      fields: fieldsWithErrors(fields, [...errors, ...externalErrors]),
    }));
  }
}

function fieldsWithErrors<Fields extends object>(
  fields: Fields,
  errors: RemoteError[],
): Fields {
  const errorDictionary = errors.reduce(
    (accumulator: any, {field, message}) => {
      if (field == null) {
        return accumulator;
      }

      return set(accumulator, field, message);
    },
    {},
  );

  return mapObject(fields, (field, path) => {
    if (!errorDictionary[path]) {
      return field;
    }

    return {
      ...field,
      error: errorDictionary[path],
    };
  });
}

function reconcileFormState<Fields extends object>(
  values: Fields,
  oldState: State<Fields>,
  externalErrors: RemoteError[] = [],
): State<Fields> {
  const {fields: oldFields} = oldState;
  const dirtyFields = new Set(oldState.dirtyFields);

  const fields: FieldStates<Fields> = mapObject(values, (value, key) => {
    const oldField = oldFields[key];

    if (isEqual(value, oldField.initialValue)) {
      return oldField;
    }

    dirtyFields.delete(key);

    return {
      value,
      initialValue: value,
      dirty: false,
    };
  });

  return {
    ...oldState,
    dirtyFields: Array.from(dirtyFields),
    fields: fieldsWithErrors(fields, externalErrors),
  };
}

function createFormState<Fields extends object>(
  values: Fields,
  externalErrors: RemoteError[] = [],
): State<Fields> {
  const fields: FieldStates<Fields> = mapObject(values, (value) => {
    return {
      value,
      initialValue: value,
      dirty: false,
    };
  });

  return {
    dirtyFields: [],
    errors: [],
    submitting: false,
    externalErrors,
    fields: fieldsWithErrors(fields, externalErrors),
  };
}

function initialValuesFromFields<Fields>(fields: FieldStates<Fields>): Fields {
  return mapObject(fields, ({initialValue}) => initialValue);
}

function runValidator<T, F>(
  validate: Validator<T, F> = () => {},
  value: T,
  fields: FieldStates<F>,
) {
  if (typeof validate === 'function') {
    return validate(value, fields);
  }

  if (!Array.isArray(validate)) {
    return;
  }

  const errors = validate
    .map((validator) => validator(value, fields))
    .filter((input) => input != null);

  if (errors.length === 0) {
    return;
  }

  return errors;
}

function runAllValidators<FieldMap>(
  state: State<FieldMap>,
  props: Props<FieldMap>,
) {
  const {fields} = state;
  const {validators} = props;

  if (!validators) {
    return null;
  }

  const updatedFields = mapObject(fields, (field, path) => {
    return {
      ...field,
      error: runValidator(validators[path], field.value, fields),
    };
  });

  return {
    ...state,
    fields: updatedFields,
  } as State<FieldMap>;
}

function collectErrors(
  message: string | any[] | {} | undefined,
): RemoteError[] {
  if (!message) {
    return [];
  }

  if (typeof message === 'string') {
    return [{message}];
  }

  if (Array.isArray(message)) {
    return flatMap(message, (itemError) => collectErrors(itemError));
  }

  return flatMap(Object.values(message), (nestedError) =>
    collectErrors(nestedError),
  );
}
