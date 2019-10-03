import {createWorker} from '../../types';

const createWorkerApi = createWorker(() => import('./fixture/module'));

type ExpectedApi = {
  stringArgStringReturn: (arg: string) => Promise<string>;
  arrayArgArrayReturn: (arg: string[]) => Promise<string[]>;
  stringArgVoidReturn: (arg: string) => Promise<void>;
  multipleArgsStringReturn: (arg1: string, argTwo: number) => Promise<string>;
  stringArgFunctionReturn: (arg: string) => () => Promise<string>;

  // is this right
  functionArgStringReturn: (
    arg: () => Promise<string>,
  ) => Promise<Promise<string>>;

  functionArgFunctionReturn: (
    arg: () => Promise<string>,
  ) => () => Promise<string>;

  // FIX: should return Promise<{func: Promsise<string>}>
  objectArgObjectReturn: (
    arg: {func: Promise<string>},
  ) => Promise<{func: string}>;

  // FIX: should return Promise<{func: () => Promise<string>}[]>;
  arrayOfObjectsWithFunctionsArg: (
    arg: {func: () => Promise<string>}[],
  ) => Promise<{func: () => Promise<string>}[]>;
};

// Compilation will fail if any of properties in the returned api do not match the expected type.
export const workerApi: ExpectedApi = createWorkerApi();
