export type ThenType<T> = T extends Promise<infer U> ? U : T;

export type Arguments<T> = T extends (...args: infer U) => any ? U : never;
export type ArgumentAtIndex<
  Func,
  Index extends keyof Arguments<Func>
> = Arguments<Func>[Index];
export type FirstArgument<T> = ArgumentAtIndex<T, 0>;

export type MaybeFunctionReturnType<T> = T extends (...args: any[]) => infer U
  ? U
  : never;

export type ArrayElement<T> = T extends (infer U)[] ? U : never;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

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

export type ConstructorArguments<T> = T extends {
  new (...args: infer U): any;
}
  ? U
  : never;

export type ConstructorArgumentAtIndex<
  T,
  I extends keyof ConstructorArguments<T>
> = ConstructorArguments<T>[I];

export type FirstConstructorArgument<T> = ConstructorArgumentAtIndex<T, 0>;
