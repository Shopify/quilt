import {WorkerInput} from '../../../types';

export function stringArgStringReturn(stringArg: WorkerInput<string>) {
  return `${stringArg}`;
}

export function arrayArgArrayReturn(arrayArg: WorkerInput<string[]>) {
  return arrayArg.map(string => `augmented: ${string}`);
}

export function stringArgVoidReturn(stringArg: string) {
  // eslint-disable-next-line no-console
  console.log(stringArg);
}

export function multipleArgsStringReturn(
  stringArg: WorkerInput<string>,
  numberArg: WorkerInput<number>,
) {
  return `${stringArg} - ${numberArg}`;
}

export function stringArgFunctionReturn(stringArg: WorkerInput<string>) {
  return () => `${stringArg}`;
}

export async function functionArgStringReturn(
  inputFunction: WorkerInput<() => string>,
) {
  const stringResult = await inputFunction();
  return stringResult;
}

export function functionArgFunctionReturn(input: WorkerInput<() => string>) {
  return () => `${input()}`;
}

export function objectArgObjectReturn(
  objectWithFunction: WorkerInput<{
    func: () => string;
  }>,
) {
  return {
    ...objectWithFunction,
    func: `augmented: ${objectWithFunction.func()}`,
  };
}

export function arrayOfObjectsWithFunctionsArg(
  arrayArg: WorkerInput<{func: () => string}[]>,
) {
  return arrayArg.concat({
    func: () => new Promise<string>(resolve => resolve('string')),
  });
}
