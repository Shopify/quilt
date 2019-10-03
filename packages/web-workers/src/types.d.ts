export function createWorker<T>(load: () => Promise<T>): () => Promisify<T>;

type Arguments<T> = T extends (...arg: infer U) => any ? U : any;

export type Promisify<T> = T extends (...args: infer Args) => infer TypeReturned
  ? TypeReturned extends () => infer Result
    ? (...args: Args) => () => Promise<Result>
    : TypeReturned extends Promise<any> // check to prevent returning Promise<Promise<thing>>> in async function
      ? (...args: Args) => TypeReturned
      : (...args: Args) => Promise<TypeReturned>
  : T extends Array<infer ArrayElement>
    ? ArrayOfPromises<ArrayElement>
    : {[K in keyof T]: Promisify<T[K]>};

interface ArrayOfPromises<T> extends Array<Promisify<T>> {}

export type WorkerInput<T> = Promisify<T>;
