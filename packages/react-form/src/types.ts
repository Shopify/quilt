import {ChangeEvent} from 'react';

export type ErrorValue = string | undefined;
export type DirtyStateComparator<Value> = (
  defaultValue: Value,
  value: Value,
) => boolean;

export interface Validator<Value, Context> {
  (value: Value, context: Context): ErrorValue;
}

export interface ListValidationContext<Item extends object> {
  listItem: FieldStates<Item>;
  siblings: FieldStates<Item>[];
}

export type Validates<Value, Context extends object = {}> =
  | Validator<Value, Context>
  | Validator<Value, Context>[];

export type NormalizedValidationDictionary<ListItem extends object> = {
  [Key in keyof ListItem]: Validator<
    ListItem[Key],
    ListValidationContext<ListItem>
  >[];
};

export type ValidationDictionary<
  ListItem extends object,
  Context extends object = {}
> = {[Key in keyof ListItem]: Validates<ListItem[Key], Context>};

export interface FieldState<Value> {
  value: Value;
  defaultValue: Value;
  error: ErrorValue;
  allErrors?: ErrorValue[];
  touched: boolean;
  dirty: boolean;
}

export type FieldStates<Record extends object> = {
  [Key in keyof Record]: FieldState<Record[Key]>;
};

export interface Field<Value> {
  value: Value;
  error: ErrorValue;
  allErrors?: ErrorValue[];
  defaultValue: Value;
  touched: boolean;
  dirty: boolean;
  onBlur(): void;
  onChange(value: Value | ChangeEvent<HTMLInputElement>): void;
  runValidation(value?: Value): ErrorValue;
  setError(value: ErrorValue): void;
  newDefaultValue(value: Value): void;
  reset(): void;
}

export type FieldDictionary<Record extends object> = {
  [Key in keyof Record]: FieldOutput<Record[Key]>;
};

export interface Form<T extends FieldBag> {
  fields: T;
  dirty: boolean;
  submitting: boolean;
  submitErrors: FormError[];
  validate(): FormError[];
  reset(): void;
  submit(event?: React.FormEvent): void;
}

export interface FormError {
  field?: string[] | null;
  message: string;
}

export type SubmitResult =
  | {
      status: 'fail';
      errors: FormError[];
    }
  | {
      status: 'success';
    };

export type FieldOutput<T> = T extends object
  ? FieldDictionary<T>
  : T extends any[]
  ? FieldDictionary<T>[]
  : Field<T>;

export type FieldBag = FieldDictionary<any>;

export interface SubmitHandler<Fields> {
  (fields: Fields): Promise<SubmitResult>;
}

/**
  Represents all of the values for a given key mapped out of a mixed dictionary of Field objects,
  nested Field objects, and arrays of nested Field objects.

  This is generally only useful if you're mapping over and transforming a nested tree of fields.
*/
export type FormMapping<
  Bag extends FieldOutput<any>,
  FieldKey extends keyof Field<any>
> = Bag extends Field<any>
  ? Bag[FieldKey]
  : Bag extends FieldDictionary<any>
  ? {[K in keyof Bag]: FormMapping<Bag[K], FieldKey>}
  : {
      [K in keyof Bag]: Bag[K] extends FieldDictionary<any>
        ? FormMapping<Bag[K], FieldKey>
        : never;
    };
