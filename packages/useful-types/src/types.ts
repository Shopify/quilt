export type ArrayElement<T> = T extends (infer U)[] ? U : never;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

export type IfEmptyObject<Obj, If, Else = never> = keyof Obj extends {
  length: 0;
}
  ? If
  : Else;

export type IfAllOptionalKeys<Obj, If, Else = never> = NonOptionalKeys<
  Obj
> extends {
  length: 0;
}
  ? If
  : Else;

export type IfAllNullableKeys<Obj, If, Else = never> = NonNullableKeys<
  Obj
> extends {length: 0}
  ? If
  : Else;

export type NonOptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

export type NonNullableKeys<T> = {
  [K in keyof T]-?: null extends T[K] ? never : K;
}[keyof T];

export type NoInfer<T> = {[K in keyof T]: T[K]} & T;

// Reference https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js#L6
type ReactStatics =
  | 'displayName'
  | 'getDerivedStateFromProps'
  | 'getDerivedStateFromErrors'
  | 'childContextTypes'
  | 'contextType'
  | 'contextTypes'
  | 'getDefaultProps'
  | 'propTypes';
export type NonReactStatics<T> = Pick<T, Exclude<keyof T, ReactStatics>>;

export type ExtendedWindow<T> = Window & typeof globalThis & T;

// Reference https://stackoverflow.com/questions/55539387/deep-omit-with-typescript
type Primitive =
  | string
  | Function
  | number
  | boolean
  | Symbol
  | undefined
  | null;
type DeepOmitHelper<T, K> = {
  [P in keyof T]: T[P] extends infer TP
    ? TP extends Primitive
      ? TP
      : TP extends (infer U)[]
      ? DeepOmit<U, K>[]
      : DeepOmit<TP, K>
    : T[P];
};

export type DeepOmit<T, K> = K extends keyof T
  ? Omit<DeepOmitHelper<T, K>, K>
  : DeepOmitHelper<T, K>;

export type DeepOmitArray<T extends any[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>;
};

export type PartialSome<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
export type RequireSome<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
