import React from 'react';
import {Arguments, MaybeFunctionReturnType} from '@shopify/useful-types';

export type PropsFor<
  T extends string | React.ComponentType<any>
> = T extends string
  ? T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : React.HTMLAttributes<T>
  : T extends React.ComponentType<any>
    ? React.ComponentPropsWithoutRef<T>
    : never;

export type FunctionKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends ((...args: any[]) => any)
    ? K
    : never
}[keyof T];

interface DeepPartialArray<T> extends Array<DeepPartial<T>> {}
interface DeepPartialReadonlyArray<T> extends ReadonlyArray<DeepPartial<T>> {}
type DeepPartialObject<T extends object> = {[K in keyof T]?: DeepPartial<T[K]>};

type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartialArray<U>
  : T extends ReadonlyArray<infer U>
    ? DeepPartialReadonlyArray<U>
    : T extends object ? DeepPartialObject<T> : T;

export type DeepPartialArguments<T> = {[K in keyof T]?: DeepPartial<T[K]>} &
  any[];

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

export interface ReactInstance {
  _reactInternalFiber: Fiber;
}

export type Predicate = (node: Node<unknown>) => boolean;

export interface Node<Props> {
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
    ...args: DeepPartialArguments<Arguments<Props[K]>>
  ): MaybeFunctionReturnType<NonNullable<Props[K]>>;
  triggerKeypath<T = unknown>(keypath: string, ...args: unknown[]): T;

  toString(): string;
}
