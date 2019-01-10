/* eslint-disable no-case-declarations */
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import set from 'lodash/set';
import {memoize, bind} from 'lodash-decorators';

import {mapObject} from './utilities';
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
    | MaybePromise<void>;
}

export type Validator<T, F> = MaybeArray<ValidationFunction<T, F>>;

export type ValidatorDictionary<FieldMap> = {
  [FieldPath in keyof FieldMap]: Validator<FieldMap[FieldPath], FieldMap>
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
  validators?: Partial<ValidatorDictionary<Fields>>;
  onSubmit?: SubmitHandler<Fields>;
  validateOnSubmit?: boolean;
  onInitialValuesChange?: 'reset-all' | 'reset-where-changed' | 'ignore';
  children(form: FormDetails<Fields>): React.ReactNode;
}

interface State<Fields> {
  submitting: boolean;
  fields: FieldStates<Fields>;
  dirtyFields: (keyof Fields)[];
  errors: RemoteError[];
}

export default class FormState<
  Fields extends Object
> extends React.PureComponent<Props<Fields>, State<Fields>> {
  static List = List;
  static Nested = Nested;

  static getDerivedStateFromProps<T>(newProps: Props<T>, oldState: State<T>) {
    const {initialValues, onInitialValuesChange} = newProps;

    switch (onInitialValuesChange) {
      case 'ignore':
        return null;
      case 'reset-where-changed':
        return reconcileFormState(initialValues, oldState);
      case 'reset-all':
      default:
        const oldInitialValues = initialValuesFromFields(oldState.fields);
        const valuesMatch = isEqual(oldInitialValues, initialValues);

        if (valuesMatch) {
          return null;
        }

        return createFormState(initialValues);
    }
  }

  state = createFormState(this.props.initialValues);
  private mounted = false;

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

  private get formData() {
    const {errors} = this.state;
    const {fields, dirty, valid} = this;

    return {
      dirty,
      valid,
      errors,
      fields,
    };
  }

  public validateForm() {
    return new Promise(resolve => {
      this.setState(runAllValidators, () => resolve());
    });
  }

  @bind()
  public reset() {
    return new Promise(resolve => {
      this.setState(
        (_state, props) => createFormState(props.initialValues),
        () => resolve(),
      );
    });
  }

  private get dirty() {
    return this.state.dirtyFields.length > 0;
  }

  private get valid() {
    const {errors} = this.state;

    return !this.hasClientErrors && errors.length === 0;
  }

  private get hasClientErrors() {
    const {fields} = this.state;

    return Object.keys(fields).some(fieldPath => {
      const field = fields[fieldPath];
      return field.error != null;
    });
  }

  private get fields() {
    const {fields} = this.state;
    const fieldDescriptors: FieldDescriptors<Fields> = mapObject(
      fields,
      this.fieldWithHandlers,
    );

    return fieldDescriptors;
  }

  @bind()
  private async submit(event?: Event) {
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

      if (this.hasClientErrors) {
        this.setState({submitting: false});
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
  }

  @memoize()
  @bind()
  private fieldWithHandlers<Key extends keyof Fields>(
    field: FieldStates<Fields>[Key],
    fieldPath: Key,
  ) {
    return {
      ...(field as FieldState<Fields[Key]>),
      name: fieldPath,
      onChange: this.updateField.bind(this, fieldPath),
      onBlur: this.blurField.bind(this, fieldPath),
    };
  }

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

    this.setState(state => ({
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

    const {validators = {}} = this.props;
    const {fields} = this.state;

    // eslint-disable-next-line consistent-return
    return runValidator(validators[fieldPath], value, fields);
  }

  private updateRemoteErrors(errors: RemoteError[]) {
    this.setState(({fields}: State<Fields>) => {
      const errorDictionary = errors.reduce(
        (accumulator: any, {field, message}) => {
          if (field == null) {
            return accumulator;
          }

          return set(accumulator, field, message);
        },
        {},
      );

      return {
        errors,
        fields: mapObject(fields, (field, path) => {
          return {
            ...field,
            error: errorDictionary[path],
          };
        }),
      };
    });
  }
}

function reconcileFormState<Fields>(
  values: Fields,
  oldState: State<Fields>,
): State<Fields> {
  const {fields: oldFields} = oldState;
  const dirtyFields = new Set(oldState.dirtyFields);

  const fields: FieldStates<Fields> = mapObject(values, (value, key) => {
    const oldField = oldFields[key];

    if (value === oldField.initialValue) {
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
    fields,
  };
}

function createFormState<Fields>(values: Fields): State<Fields> {
  const fields: FieldStates<Fields> = mapObject(values, value => {
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
    fields,
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
    // eslint-disable-next-line consistent-return
    return validate(value, fields);
  }

  if (!isArray(validate)) {
    // eslint-disable-next-line consistent-return
    return;
  }

  const errors = validate
    .map(validator => validator(value, fields))
    .filter(input => input != null);

  if (errors.length === 0) {
    // eslint-disable-next-line consistent-return
    return;
  }

  // eslint-disable-next-line consistent-return
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
