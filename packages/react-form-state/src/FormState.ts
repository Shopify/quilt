import * as React from 'react';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import set from 'lodash/set';
import {memoize, bind} from 'lodash-decorators';

import {mapObject} from './utilities';
import {Fields, FieldState} from './types';
import {List, Nested} from './components';

export interface RemoteError {
  field?: string[] | null;
  message: string;
}

export type FieldStates<FieldMap> = {
  [FieldPath in keyof FieldMap]: FieldState<FieldMap[FieldPath]>
};

type MaybeArray<T> = T | T[];
type MaybePromise<T> = T | Promise<T>;

interface SubmitHandler<FieldMap> {
  (formDetails: FormData<FieldMap>):
    | MaybePromise<RemoteError[]>
    | MaybePromise<void>;
}

export type ValidatorDictionary<FieldMap> = {
  [FieldPath in keyof FieldMap]: MaybeArray<
    ValidationFunction<FieldMap[FieldPath], FieldMap>
  >
};

interface ValidationFunction<Value, Fields> {
  (value: Value, fields: FieldStates<Fields>): any;
}

export interface FormData<FieldMap> {
  fields: Fields<FieldMap>;
  dirty: boolean;
  valid: boolean;
  errors: RemoteError[];
}

export interface FormDetails<FieldMap> extends FormData<FieldMap> {
  submitting: boolean;
  reset(): void;
  submit(): void;
}

interface Props<FieldMap> {
  initialValues: FieldMap;
  validators?: Partial<ValidatorDictionary<FieldMap>>;
  onSubmit?: SubmitHandler<FieldMap>;
  children(form: FormDetails<FieldMap>): React.ReactNode;
}

interface State<FieldMap> {
  submitting: boolean;
  fields: FieldStates<FieldMap>;
  dirtyFields: (keyof FieldMap)[];
  errors: RemoteError[];
}

export default class FormState<
  FieldMap extends Object
> extends React.PureComponent<Props<FieldMap>, State<FieldMap>> {
  static List = List;
  static Nested = Nested;

  static getDerivedStateFromProps<T>(newProps: Props<T>, oldState?: State<T>) {
    const newInitialValues = newProps.initialValues;

    if (oldState == null) {
      return createFormState(newInitialValues);
    }

    const oldInitialValues = initialValuesFromFields(oldState.fields);
    const shouldReinitialize = !isEqual(oldInitialValues, newInitialValues);

    if (shouldReinitialize) {
      return createFormState(newInitialValues);
    }

    return null;
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

  private get dirty() {
    return this.state.dirtyFields.length > 0;
  }

  private get valid() {
    const {errors, fields} = this.state;

    const fieldsWithErrors = Object.keys(fields).filter(fieldPath => {
      const {error} = fields[fieldPath];
      return error != null;
    });

    return fieldsWithErrors.length === 0 && errors.length === 0;
  }

  private get fields() {
    const {fields: rawFields} = this.state;
    const fields: Fields<FieldMap> = mapObject(
      rawFields,
      this.fieldWithHandlers,
    );

    return fields;
  }

  @bind()
  private async submit(event?: Event) {
    const {onSubmit} = this.props;
    const {formData, mounted} = this;

    if (!mounted) {
      return;
    }

    if (event && !event.defaultPrevented) {
      event.preventDefault();
    }

    if (onSubmit == null) {
      return;
    }

    this.setState({submitting: true});

    const errors = await onSubmit(formData);

    if (!mounted) {
      return;
    }

    if (errors) {
      this.updateRemoteErrors(errors);
    }

    this.setState({submitting: false});
  }

  @bind()
  private reset() {
    this.setState(createFormState(this.props.initialValues));
  }

  @memoize()
  @bind()
  private fieldWithHandlers<Key extends keyof FieldMap>(
    field: FieldStates<FieldMap>[Key],
    fieldPath: Key,
  ) {
    return {
      ...(field as FieldState<FieldMap[Key]>),
      name: fieldPath,
      onChange: this.updateField.bind(this, fieldPath),
      onBlur: this.blurField.bind(this, fieldPath),
    };
  }

  private updateField<Key extends keyof FieldMap>(
    fieldPath: Key,
    value: FieldMap[Key],
  ) {
    this.setState<any>(({fields, dirtyFields}: State<FieldMap>) => {
      const field = fields[fieldPath];
      const dirty = !isEqual(value, field.initialValue);

      const updatedField = this.getUpdatedField({
        fieldPath,
        field,
        value,
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

  private getUpdatedDirtyFields<Key extends keyof FieldMap>({
    fieldPath,
    dirty,
    dirtyFields,
  }: {
    fieldPath: Key;
    dirty: boolean;
    dirtyFields: (keyof FieldMap)[];
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

  private getUpdatedField<Key extends keyof FieldMap>({
    fieldPath,
    field,
    value,
    dirty,
  }: {
    fieldPath: Key;
    field: FieldStates<FieldMap>[Key];
    value: FieldMap[Key];
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
      ...(field as FieldState<FieldMap[Key]>),
      value,
      dirty,
      error,
    };
  }

  private blurField<Key extends keyof FieldMap>(fieldPath: Key) {
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
          ...(state.fields[fieldPath] as FieldState<FieldMap[Key]>),
          error,
        },
      },
    }));
  }

  private validateFieldValue<Key extends keyof FieldMap>(
    fieldPath: Key,
    {value, dirty}: Pick<FieldState<FieldMap[Key]>, 'value' | 'dirty'>,
  ) {
    if (!dirty) {
      return;
    }

    const {validators = {}} = this.props;
    const {fields} = this.state;
    const validate = validators[fieldPath];

    if (typeof validate === 'function') {
      // eslint-disable-next-line consistent-return
      return validate(value, fields);
    }

    if (!isArray(validate)) {
      return;
    }

    const errors = validate
      .map(validator => validator(value, fields))
      .filter(input => input != null);

    if (errors.length === 0) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return errors;
  }

  private updateRemoteErrors(errors: RemoteError[]) {
    this.setState(({fields}: State<FieldMap>) => {
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
