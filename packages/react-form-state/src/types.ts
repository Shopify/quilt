export interface FieldState<Value> {
  name: string;
  initialValue: Value;
  value: Value;
  dirty: boolean;
  changed: boolean;
  error?: any;
}

export interface ValidationFunction<Value, Fields> {
  (value: Value, fields: FieldStates<Fields>): any;
}

export interface FieldDescriptor<Value> extends FieldState<Value> {
  onChange(newValue: Value | ValueMapper<Value>): void;
  onBlur(): void;
}

export type FieldDescriptors<Fields> = {
  [FieldPath in keyof Fields]: FieldDescriptor<Fields[FieldPath]>;
};

export interface ValueMapper<Value> {
  (value: Value): Value;
}

export type FieldStates<Fields> = {
  [FieldPath in keyof Fields]: FieldState<Fields[FieldPath]>;
};
