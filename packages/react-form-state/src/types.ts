export interface FieldState<Value> {
  name: string;
  initialValue: Value;
  value: Value;
  dirty: boolean;
  changed: boolean;
  error?: any;
}

export interface Field<Value> extends FieldState<Value> {
  onChange(newValue: Value): void;
  onBlur(): void;
}

export type Fields<FieldMap> = {
  [FieldPath in keyof FieldMap]: Field<FieldMap[FieldPath]>
};
