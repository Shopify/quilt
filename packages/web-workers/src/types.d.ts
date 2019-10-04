import {promisify} from 'util';

export function createWorker<T>(load: () => Promise<T>): () => Promisify<T>;

type Arguments<T> = T extends (...arg: infer U) => any ? U : any;

type ReturnTypes = string | number | boolean | {} | void;
type ReturnTypesToAugment = ReturnTypes | ReturnTypes[];

export type Promisify<T> = T extends (...args: infer Args) => infer TypeReturned
  ? TypeReturned extends () => infer ReturnTypesToAugment
    ? (...args: Args) => () => Promise<ReturnTypesToAugment>
    : TypeReturned extends ReturnTypesToAugment
      ? (...args: Args) => Promise<Promisify<TypeReturned>>
      : (...args: Args) => Promisify<TypeReturned>
  : T extends Array<infer ArrayElement>
    ? PromisifyArray<ArrayElement>
    : {[K in keyof T]: Promisify<T[K]>};

interface PromisifyArray<T> extends Array<Promisify<T>> {}

export type WorkerInput<T> = T extends () => infer TypeReturned
  ? TypeReturned extends ReturnTypesToAugment
    ? () => TypeReturned | Promise<TypeReturned>
    : T
  : T;
