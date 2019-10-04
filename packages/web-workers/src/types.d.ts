import {promisify} from 'util';

export function createWorker<T>(
  load: () => Promise<T>,
): () => PromisifyModule<T>;

type Arguments<T> = T extends (...arg: infer U) => any ? U : any;

type ReturnTypes = string | number | boolean | null | undefined;
type ReturnTypesToAugment = ReturnTypes | ReturnTypes[];

export type PromisifyModule<T> = {[K in keyof T]: PromisifyExport<T[K]>};

export type PromisifyExport<T> = T extends (
  ...args: infer Args
) => infer TypeReturned
  ? (...args: Args) => Promise<ForcePromiseWrapped<TypeReturned>>
  : never;

export type ForcePromiseWrapped<T> = T extends infer U | Promise<infer U>
  ? ForcePromise<U>
  : ForcePromise<T>;

export type ForcePromise<T> = T extends Promise<any>
  ? T
  : T extends (...args: infer Args) => infer TypeReturned
    ? (...args: Args) => Promise<ForcePromiseWrapped<TypeReturned>>
    : T extends Array<infer ArrayElement>
      ? ForcePromiseArray<ArrayElement>
      : T extends object ? {[K in keyof T]: ForcePromiseWrapped<T[K]>} : T;

interface ForcePromiseArray<T> extends Array<ForcePromiseWrapped<T>> {}

export type WorkerInput<T> = T extends (
  ...args: infer Args
) => infer TypeReturned
  ? TypeReturned extends Promise<any>
    ? (...args: Args) => TypeReturned
    : (...args: Args) => TypeReturned | Promise<TypeReturned>
  : T extends Array<infer ArrayElement>
    ? WorkerInputArray<ArrayElement>
    : T extends object ? {[K in keyof T]: WorkerInput<T[K]>} : T;

interface WorkerInputArray<T> extends Array<WorkerInput<T>> {}
