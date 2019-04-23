import {ComponentType, HTMLAttributes} from 'react';

export type ThenType<T> = T extends Promise<infer U> ? U : T;

export type Arguments<T> = T extends (...args: infer U) => any ? U : never;
export type FirstArgument<T> = T extends ((arg: infer U) => any) ? U : never;
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
      : DeepPartial<T[P]>
};

export type Props<T> = T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : T extends string
    ? HTMLAttributes<T>
    : T extends ComponentType<infer Props> ? Props : never;

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
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T];

export type NonNullableKeys<T> = {
  [K in keyof T]-?: null extends T[K] ? never : K
}[keyof T];

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
