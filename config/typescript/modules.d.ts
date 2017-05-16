declare namespace jest {
  type Promisify<T> = {
    [P in keyof T]: (...args: any[]) => Promise<void>;
  }

  interface Matchers {
    resolves: Promisify<Matchers>,
    rejects: Promisify<Matchers>,
  }
}
