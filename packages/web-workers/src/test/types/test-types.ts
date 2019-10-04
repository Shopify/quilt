import {createWorker} from '../../types';

const createWorkerApi = createWorker(() => import('./fixture/module'));

type ExpectedApi = {
  stringArgStringReturn: (arg: string) => Promise<string>;

  arrayArgArrayReturn: (arg: string[]) => Promise<string[]>;

  stringArgVoidReturn: (arg: string) => Promise<void>;

  multipleArgsStringReturn: (arg1: string, argTwo: number) => Promise<string>;

  stringArgFunctionReturn: (arg: string) => () => Promise<string>;

  // Ummm... fix
  functionArgStringReturn: (
    arg: () => string | Promise<string>,
  ) => Promise<Promise<string> | string>;

  functionArgFunctionReturn: (
    arg: () => Promise<string>,
  ) => () => Promise<string>;

  objectWithStringArgObjectReturn: (
    arg: {foo: string},
  ) => Promise<{foo: string}>;

  // BROKEN: Should return Promise<{func: () => Promise<string>}>
  objectWithFunctionArgObjectReturn: (
    arg: {func: () => string | Promise<string>},
  ) => Promise<{func: () => Promise<string>}>;

  // BROKEN: Should return Promise<{func: () => Promise<string>}>[]
  arrayOfObjectsWithFunctionsArg: (
    arg: {func: () => string | Promise<string>}[],
  ) => Promise<{func: () => Promise<string>}[]>;

  returnsFunctionReturningObjectWithFunction: () => Promise<
    () => Promise<{foo: () => Promise<string>}>
  >;
};

// Compilation will fail if any of properties in the returned api do not match the expected type.
export const workerApi: ExpectedApi = createWorkerApi();

// Type '{ func: () => string; }' is missing the following properties from
// type 'Promise<{ func: () => string; }>'
