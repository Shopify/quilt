// -------------------------------------------------------------------------------------------------- //
// Replace with @shopify/useful-types when fixed types are merged
// -------------------------------------------------------------------------------------------------- //
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends infer TP
    ? TP extends (infer U)[]
      ? DeepPartial<U>[]
      : TP extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
    : T[P];
};

// -------------------------------------------------------------------------------------------------- //
// move to @shopify/useful-types after initial release (simplifies testing to not change other packages)
// -------------------------------------------------------------------------------------------------- //
type Primitive =
  | string
  | Function
  | number
  | boolean
  | Symbol
  | undefined
  | null;

export type DeepOmitOptional<T> = T extends Primitive
  ? T
  : {
      [K in keyof T]: {} extends Pick<T, K>
        ? never
        : T[K] extends infer TK
        ? TK extends (infer U)[]
          ? DeepOmitOptional<U>[]
          : TK extends ReadonlyArray<infer U>
          ? ReadonlyArray<DeepOmitOptional<U>>
          : DeepOmitOptional<TK>
        : T[K];
    };

export type Thunk<T, A = never> = ((arg: A) => T) | T;

// -------------------------------------------------------------------------------- //
