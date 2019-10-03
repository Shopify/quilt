export function createWorker<T>(load: () => Promise<T>): () => Promisify<T>;

export type Promisify<T> = T extends (...args: infer Args) => infer TypeReturned
  ? TypeReturned extends () => infer Result
    ? (...args: PromisifyArgs<Args>) => () => Promise<Result>
    : (...args: PromisifyArgs<Args>) => Promise<TypeReturned>
  : T extends Array<infer ArrayElement>
    ? ArrayOfPromises<ArrayElement>
    : {[K in keyof T]: Promisify<T[K]>};

type PromisifyArgs<T> = StripWorkerInput<
  T extends (...args: infer Args) => infer TypeReturned
    ? TypeReturned extends () => infer Result
      ? (...args: Promisify<Args>) => () => Promise<Result>
      : (...args: Promisify<Args>) => Promise<TypeReturned>
    : {[K in keyof T]: PromisifyArgs<T[K]>}
>;

interface ArrayOfPromises<T> extends Array<Promisify<T>> {}

// Feels a bit naive. Are we able to check something like
// T extends WorkerInput<T>
// It doesn't work because WorkInput already augments the return type we don't know the origin of workerInput
export type StripWorkerInput<T> = T extends () => Promise<infer U>
  ? () => U
  : T;

export type WorkerInput<T> = Promisify<T>;
