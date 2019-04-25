import {ChangeEvent} from 'react';

export type ErrorValue = string | undefined;

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
  >[]
};

export type ValidationDictionary<
  ListItem extends object,
  Context extends object = {}
> = {[Key in keyof ListItem]: Validates<ListItem[Key], Context>};

export interface FieldState<Value> {
  value: Value;
  defaultValue: Value;
  error: ErrorValue;
  touched: boolean;
  dirty: boolean;
}

export type FieldStates<Record extends object> = {
  [Key in keyof Record]: FieldState<Record[Key]>
};

export interface Field<Value> {
  value: Value;
  error: ErrorValue;
  defaultValue: Value;
  touched: boolean;
  dirty: boolean;
  onBlur(): void;
  onChange(value: Value | ChangeEvent<HTMLInputElement>): void;
  runValidation(): ErrorValue;
  setError(value: ErrorValue): void;
  newDefaultValue(value: Value): void;
  reset(): void;
}

export type FieldDictionary<Record extends object> = {
  [Key in keyof Record]: Field<Record[Key]>
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
  fieldPath?: string[];
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

export type FieldOutput<T extends object> =
  | FieldDictionary<T>
  | Field<T>
  | FieldDictionary<T>[];

export interface FieldBag {
  [key: string]: FieldOutput<any>;
}

export interface SubmitHandler<Fields> {
  (fields: Fields): Promise<SubmitResult>;
}

type FieldProp<T, K extends keyof Field<any>> = T extends Field<any>
  ? T[K]
  : T extends FieldDictionary<any>
    ? {[InnerKey in keyof T]: T[InnerKey][K]}
    : T;

/*
  Represents all of the values for a given key mapped out of a mixed dictionary of Field objects,
  nested Field objects, and arrays of nested Field objects
*/
export type FormMapping<
  Bag extends {[key: string]: FieldOutput<any>},
  FieldKey extends keyof Field<any>
> = {
  [Key in keyof Bag]: Bag[Key] extends any[]
    ? {[Index in keyof Bag[Key]]: FieldProp<Bag[Key][Index], FieldKey>}
    : FieldProp<Bag[Key], FieldKey>
};
