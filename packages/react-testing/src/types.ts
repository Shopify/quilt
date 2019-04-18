import * as React from 'react';

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
