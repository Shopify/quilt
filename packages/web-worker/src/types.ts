export type PromisifyModule<T> = {[K in keyof T]: PromisifyExport<T[K]>};

export type PromisifyExport<T> = T extends (
  ...args: infer Args
) => infer TypeReturned
  ? (...args: Args) => Promise<ForcePromiseWrapped<TypeReturned>>
  : never;

type ForcePromiseWrapped<T> = T extends infer U | Promise<infer U>
  ? ForcePromise<U>
  : ForcePromise<T>;

type ForcePromise<T> = T extends Promise<any>
  ? T
  : T extends (...args: infer Args) => infer TypeReturned
    ? (...args: Args) => Promise<ForcePromiseWrapped<TypeReturned>>
    : T extends Array<infer ArrayElement>
      ? ForcePromiseArray<ArrayElement>
      : T extends object ? {[K in keyof T]: ForcePromiseWrapped<T[K]>} : T;

interface ForcePromiseArray<T> extends Array<ForcePromiseWrapped<T>> {}

export type SafeWorkerArgument<T> = T extends (
  ...args: infer Args
) => infer TypeReturned
  ? TypeReturned extends Promise<any>
    ? (...args: Args) => TypeReturned
    : (...args: Args) => TypeReturned | Promise<TypeReturned>
  : T extends Array<infer ArrayElement>
    ? SafeWorkerArgumentArray<ArrayElement>
    : T extends object ? {[K in keyof T]: SafeWorkerArgument<T[K]>} : T;

interface SafeWorkerArgumentArray<T> extends Array<SafeWorkerArgument<T>> {}
