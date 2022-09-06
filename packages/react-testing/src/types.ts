import React from 'react';

type IsNeverType<T> = [T] extends [never] ? true : false;
type Rest<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;

type AllKeys<T> = T extends any ? keyof T : never;
type PickType<T, K extends AllKeys<T>> = T extends {[k in K]?: any}
  ? T[K]
  : undefined;
type PickTypeOf<T, K extends PropertyKey> = T extends any
  ? K extends AllKeys<T>
    ? PickType<T, K>
    : never
  : never;

type Merge<T> = {[K in keyof T]: PickTypeOf<T, K>} & {
  [K in Exclude<AllKeys<T>, keyof T>]?: PickTypeOf<T, K>;
};

type IsArrayIndex<T extends string> = `${number}` extends T
  ? true
  : string extends T
  ? true
  : T extends `${infer Head}${infer Rest}`
  ? Head extends '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
    ? Rest extends ''
      ? true
      : IsArrayIndex<Rest>
    : false
  : false;

type ExtractProperty<Props, PropKeys extends any[]> = Merge<
  Extract<Props, object>
> extends infer MergedProps
  ? PropKeys[0] extends undefined
    ? Props
    : PropKeys[0] extends keyof MergedProps
    ? IfNever<
        Extract<MergedProps[PropKeys[0]], ReadonlyArray<any>>,
        unknown
      > extends ReadonlyArray<infer ArrayType>
      ? PropKeys[1] extends undefined
        ? MergedProps[PropKeys[0]]
        : IsArrayIndex<PropKeys[1]> extends true
        ? ExtractProperty<ArrayType, Rest<Rest<PropKeys>>>
        : never
      : ExtractProperty<MergedProps[PropKeys[0]], Rest<PropKeys>>
    : never
  : never;

type Split<
  String extends string,
  Delimiter extends string,
> = string extends String
  ? string[]
  : String extends ''
  ? []
  : String extends `${infer T}${Delimiter}${infer U}`
  ? [T, ...Split<U, Delimiter>]
  : [String];

type NormalizeKeypath<Path extends string> =
  Path extends `${infer A}.[${infer B}].${infer C}`
    ? NormalizeKeypath<`${A}.${B}.${C}`>
    : Path extends `${infer A}[${infer B}].${infer C}`
    ? NormalizeKeypath<`${A}.${B}.${C}`>
    : Path extends `${infer A}[${infer B}]${infer C}`
    ? NormalizeKeypath<`${A}.${B}.${C}`>
    : Path;

export type ExtractKeypath<Props, Keypath extends string> = ExtractProperty<
  Props,
  Split<NormalizeKeypath<Keypath>, '.'>
> extends infer R
  ? R extends KeyPathFunction
    ? R
    : never
  : never;

type IfNever<C, F> = IsNeverType<C> extends true ? F : C;
type IsUnknown<T> = unknown extends T
  ? [T] extends [null]
    ? false
    : true
  : false;

type IsSkippedType<Props, Path extends string> = IsUnknown<Props> extends true
  ? true
  : string extends Path
  ? true
  : false;

export type KeyPathFunction = Function | ((...args: any[]) => any);

export type TriggerKeypathParams<
  Props,
  Path extends string,
  ExtractedFunction extends KeyPathFunction,
> = IsSkippedType<Props, Path> extends false
  ? [
      keypath: IsNeverType<ExtractedFunction> extends true ? never : Path,
      ...args: ExtractedFunction extends (...args: any[]) => any
        ? DeepPartialArguments<Parameters<ExtractedFunction>>
        : any[],
    ]
  : [keypath: string, ...args: unknown[]];

export type TriggerKeypathReturn<
  Props,
  Path extends string,
  ExtractedFunction extends KeyPathFunction,
> = IsSkippedType<Props, Path> extends false
  ? ExtractedFunction extends (...args: any[]) => any
    ? ReturnType<ExtractedFunction>
    : any
  : any;

export type PropsFor<T extends string | React.ComponentType<any>> =
  T extends string
    ? T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T]
      : React.HTMLAttributes<T>
    : T extends React.ComponentType<any>
    ? React.ComponentPropsWithoutRef<T>
    : never;

export type UnknowablePropsFor<
  T extends string | React.ComponentType<any> | unknown,
> = T extends string | React.ComponentType<any> ? PropsFor<T> : unknown;

export type FunctionKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends (...args: any[]) => any
    ? K
    : never;
}[keyof T];

interface DeepPartialArray<T> extends Array<DeepPartial<T>> {}
interface DeepPartialReadonlyArray<T> extends ReadonlyArray<DeepPartial<T>> {}
type DeepPartialObject<T extends object> = {[K in keyof T]?: DeepPartial<T[K]>};

type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartialArray<U>
  : T extends ReadonlyArray<infer U>
  ? DeepPartialReadonlyArray<U>
  : T extends object
  ? DeepPartialObject<T>
  : T;

export type DeepPartialArguments<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
} & any[];

// https://github.com/facebook/react/blob/master/packages/shared/ReactWorkTag.js
export enum Tag {
  FunctionComponent = 0,
  ClassComponent = 1,
  IndeterminateComponent = 2,
  HostRoot = 3,
  HostPortal = 4,
  HostComponent = 5,
  HostText = 6,
  Fragment = 7,
  Mode = 8,
  ContextConsumer = 9,
  ContextProvider = 10,
  ForwardRef = 11,
  Profiler = 12,
  SuspenseComponent = 13,
  MemoComponent = 14,
  SimpleMemoComponent = 15,
  LazyComponent = 16,
  IncompleteClassComponent = 17,
  DehydratedSuspenseComponent = 18,
}

export interface Fiber {
  tag: Tag;
  key: null | string;
  elementType: React.ComponentType | string | null;
  type: React.ComponentType | string | null;
  stateNode: any;
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  index: number;
  ref: React.LegacyRef<unknown>;
  pendingProps: unknown;
  memoizedProps: unknown;
  memoizedState: unknown;
}

export type ReactInstance =
  | {
      _reactInternals: Fiber;
    }
  | {
      _reactInternalFiber: Fiber;
    };

export type Predicate = (node: Node<unknown>) => boolean;

export interface Node<Props extends {} | unknown> {
  readonly props: Props;
  readonly type: string | React.ComponentType<any> | null;
  readonly isDOM: boolean;
  readonly instance: any;
  readonly children: Node<unknown>[];
  readonly descendants: Node<unknown>[];
  readonly domNodes: HTMLElement[];
  readonly domNode: HTMLElement | null;

  data(key: string): string | undefined;
  prop<K extends keyof Props>(key: K): Props[K];

  text(): string;
  html(): string;

  is<Type extends React.ComponentType<any> | string>(
    type: Type,
  ): this is Node<PropsFor<Type>>;

  find<Type extends React.ComponentType<any> | string>(
    type: Type,
    props?: Partial<PropsFor<Type>>,
  ): Node<PropsFor<Type>> | null;
  findAll<Type extends React.ComponentType<any> | string>(
    type: Type,
    props?: Partial<PropsFor<Type>>,
  ): Node<PropsFor<Type>>[];
  findWhere(predicate: Predicate): Node<unknown> | null;
  findAllWhere(predicate: Predicate): Node<unknown>[];

  trigger<K extends FunctionKeys<Props>>(
    prop: K,
    ...args: DeepPartialArguments<Props[K]>
  ): NonNullable<Props[K]> extends (...args: any[]) => any
    ? ReturnType<NonNullable<Props[K]>>
    : never;
  triggerKeypath<
    Path extends string,
    ExtractedFunction extends KeyPathFunction = ExtractKeypath<Props, Path>,
  >(
    ...args: TriggerKeypathParams<Props, Path, ExtractedFunction>
  ): TriggerKeypathReturn<Props, Path, ExtractedFunction>;

  debug(options?: DebugOptions): string;
  toString(): string;
}

export interface DebugOptions {
  allProps?: boolean;
  depth?: number;
  verbosity?: number;
}
