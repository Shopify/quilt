import * as React from 'react';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import {memoize, bind} from 'lodash-decorators';

import {mapObject} from './utilities';
import {FieldDescriptors, ClientError, FieldState} from './types';
import {List, Nested} from './components';

interface RemoteError {
  field: string[] | null;
  message: string;
}

export type FormError = RemoteError | ClientError;

export type FieldStates<Fields> = {
  [FieldPath in keyof Fields]: FieldState<Fields[FieldPath]>
};

type MaybeArray<T> = T | T[];
type MaybePromise<T> = T | Promise<T>;

interface SubmitHandler<Fields> {
  (fields: FieldStates<Fields>): MaybePromise<FormError[]> | MaybePromise<void>;
}

export type ValidatorDictionary<Fields> = {
  [FieldPath in keyof Fields]: MaybeArray<
    ValidationFunction<Fields[FieldPath], Fields>
  >
};

interface ValidationFunction<Value, Fields> {
  (value: Value, fields: FieldStates<Fields>): any;
}

export interface FormDetails<Fields> {
  fields: FieldDescriptors<Fields>;
  dirty: boolean;
  valid: boolean;
  submitting: boolean;
  errors: ClientError[];
  reset(): void;
  submit(): void;
}

interface Props<Fields> {
  initialValues: Fields;
  validators?: Partial<ValidatorDictionary<Fields>>;
  onSubmit?: SubmitHandler<Fields>;
  children(form: FormDetails<Fields>): React.ReactNode;
}

interface State<Fields> {
  submitting: boolean;
  errors: ClientError[];
  dirtyFields: (keyof Fields)[];
  fields: FieldStates<Fields>;
}

export default class FormState<
  Fields extends Object
> extends React.PureComponent<Props<Fields>, State<Fields>> {
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
    const {submitting, errors} = this.state;
    const {fields, reset, submit, dirty, valid} = this;

    return children({
      submit,
      reset,
      submitting,
      dirty,
      valid,
      errors,
      fields,
    });
  }

  private get dirty() {
    return this.state.dirtyFields.length > 0;
  }

  private get valid() {
    return this.allErrors.length === 0;
  }

  private get fields() {
    const {fields} = this.state;

    const fieldDescriptors: FieldDescriptors<Fields> = mapObject(
      fields,
      (field, path) => {
        return {
          name: path,
          ...field,
          ...this.getHandlersForField(path),
        };
      },
    );

    return fieldDescriptors;
  }

  private get allErrors(): ClientError[] {
    const {errors, fields} = this.state;

    const fieldErrors = Object.keys(fields)
      .map(field => {
        const {error: message} = fields[field];
        return {message, field};
      })
      .filter(error => {
        return error.field != null && error.message != null;
      }) as ClientError[];

    return [...errors, ...fieldErrors];
  }

  @bind
  private async submit(event?: Event) {
    if (!this.mounted) {
      return;
    }

    if (event && !event.defaultPrevented) {
      event.preventDefault();
    }

    const {onSubmit} = this.props;
    const {fields} = this.state;

    if (onSubmit == null) {
      return;
    }

    this.setState({
      ...createFormState(valuesFromFields(fields)),
      submitting: true,
    });

    const result = await onSubmit(fields);

    if (result) {
      this.updateErrors(result);
    }

    this.setState({submitting: false});
  }

  @bind
  private reset() {
    this.setState(createFormState(this.props.initialValues));
  }

  @memoize
  private getHandlersForField(path: keyof FieldStates<Fields>) {
    return {
      onChange: this.updateField.bind(this, path),
      onBlur: this.blurField.bind(this, path),
    };
  }
  private updateField<K extends keyof Fields>(fieldPath: K, value: Fields[K]) {
    this.setState<any>(({fields, dirtyFields}: State<Fields>) => {
      const field = fields[fieldPath];
      const {error} = field;

      const dirty = !isEqual(value, field.initialValue);
      const newDirtyFields = new Set(dirtyFields);

      if (dirty) {
        newDirtyFields.add(fieldPath);
      } else {
        newDirtyFields.delete(fieldPath);
      }

      const newFieldData = Object.assign({}, field, {
        value,
        dirty,
      });

      /*
        We only want to update errors as the user types if they
        already have an error.
        https://polaris.shopify.com/patterns/error-messages#section-form-validation
      */
      const shouldUpdateError = error != null;

      const newError = shouldUpdateError
        ? this.validateFieldValue(fieldPath, newFieldData)
        : // eslint-disable-next-line no-undefined
          undefined;

      return {
        dirtyFields: [...Array.from(newDirtyFields)],
        fields: Object.assign({}, fields, {
          [fieldPath]: Object.assign({}, newFieldData, {error: newError}),
        }),
      };
    });
  }

  private blurField<Key extends keyof Fields>(fieldPath: Key) {
    const {fields} = this.state;
    const field = fields[fieldPath];
    const error = this.validateFieldValue<Key>(fieldPath, field);

    if (error == null) {
      return;
    }

    this.setState(state => ({
      fields: Object.assign({}, state.fields, {
        [fieldPath]: Object.assign({}, state.fields[fieldPath], {error}),
      }),
    }));
  }

  private validateFieldValue<Key extends keyof Fields>(
    fieldPath: Key,
    {value, dirty}: FieldState<Fields[Key]>,
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

  private updateErrors(newErrors: FormError[]) {
    this.setState(({fields}: State<Fields>) => {
      const newFields = {...(fields as any)};

      const errors: ClientError[] = newErrors.map(({message, field}) => {
        if (field == null) {
          return {message};
        }

        if (isArray(field)) {
          return {message, field: field.join('.')};
        }

        return {message, field};
      });

      return {
        errors,
        fields: newFields,
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
    fields,
    submitting: false,
  };
}

function valuesFromFields<Fields>(fields: FieldStates<Fields>): Fields {
  return mapObject(fields, ({value}) => value);
}

function initialValuesFromFields<Fields>(fields: FieldStates<Fields>): Fields {
  return mapObject(fields, ({initialValue}) => initialValue);
}
