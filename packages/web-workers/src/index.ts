import WebWorkers from './WebWorkers';
import {createWorker, expose, Promisified} from './types';

export default WebWorkers;

type Argument<T> = T extends (arg: infer U) => any ? U : any;

export function promisify<S extends (arg: Argument<S>) => void>(
  fn: S,
): (arg: Argument<S>) => Promise<ReturnType<typeof fn>> {
  return arg =>
    new Promise((resolve, reject) => {
      try {
        resolve(fn(arg) as ReturnType<typeof fn>);
      } catch (err) {
        reject(err);
      }
    });
}

// function hello(input: number) {
//   return [`hello, ${input}`];
// }
// // Typed as: const promisifedHello: (arg: number) => Promise<string[]>
// const promisifedHello = promisify(hello);

async function moduleThing() {
  const foo = () => import('./worker');
  const moduleMaybe = await foo();
  const promisifedThings = (moduleMaybe as unknown) as Promisified<
    typeof moduleMaybe
  >;

  const promisifedHello = promisifedThings.hello;
}

const create = createWorker(() => import('./worker'));
const workerApi = create();
const promiseyThing = workerApi.hello;

// returns a promise for a function that returns a promise for a string is what we want
// 1) UI thread calls worker
// 2) worker returns a promise for a function that returns a promise for a string (comlink layer)
// 3) left with a function from the main thread that calls UI thread with function
// helloFunction is only ever called once
const promiseyFunctionThing = workerApi.helloFunction;

const testOne: {hello: () => Promise<string>} = createWorker(() =>
  Promise.resolve({hello: () => 'world'}),
)();
