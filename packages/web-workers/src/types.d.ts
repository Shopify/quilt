export function createWorker<T>(load: () => Promise<T>): () => Promisify<T>;

export type Promisify<T> = T extends (...args: infer Args) => infer TypeReturned
  ? TypeReturned extends () => infer Result
    ? (...args: PromisifyArgs<Args>) => () => Promise<Result>
    : (...args: PromisifyArgs<Args>) => Promise<TypeReturned>
  : T extends Array<infer ArrayElement>
    ? ArrayOfPromises<ArrayElement>
    : {[K in keyof T]: Promisify<T[K]>};

type PromisifyArgs<T> = T extends (...args: infer Args) => infer TypeReturned
  ? TypeReturned extends () => infer Result
    ? (...args: Promisify<Args>) => () => Promise<Result>
    : (...args: Promisify<Args>) => Promise<TypeReturned>
  : {[K in keyof T]: PromisifyArgs<T[K]>};

interface ArrayOfPromises<T> extends Array<Promisify<T>> {}
