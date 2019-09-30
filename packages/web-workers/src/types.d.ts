type AnyFunction = (...args: any[]) => any;
type Arguments<T> = T extends (...arg: infer U) => any ? U : any;

// declare module '@shopify/workerize' {
// Returns function when called, creates a proxy to worker
export function createWorker<T>(load: () => Promise<T>): () => Promisified<T>;

// export function expose<T extends object>(creator: () => T): Promisified<T>;

// (...args: Arguments<T[K]>) => ReturnType<T[K]>

export type Promisified<T> = {
  [K in keyof T]: T[K] extends AnyFunction
    ? (...args: Arguments<T[K]>) => Promise<ReturnType<T[K]>>
    : never
};

declare function Promisify<P extends (arg: Arguments<P>) => void>(
  fn: P,
): (arg: Arguments<P>) => Promise<ReturnType<typeof fn>>;

// TODO
// - helper types
// consumer passes in a function for name
// }

// function hello(world: {name(): string}) {}

// this wont _just work_
// function hello(world: () => string) {}

// provide helper type that takes any type => for every function, turn it into a function that
// returns the actual result OR promisified version of the result
// for worker function that are functions that return a thing

// UI thread                                      // Worker
// tried to call a function in worker        =>  accepts arugment that is a function type
// promise returns pretend function          =>  executing promise => pretend function
// Runs function from worker                 =>     doesn't do anything, still waiting
// Sends message to worker with result of calling function => has result, now mark promise as resolved
