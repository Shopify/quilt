import {WorkerInput} from '../../../types';

export function stringArgStringReturn(stringArg: WorkerInput<string>) {
  return `${stringArg}`;
}

export function arrayArgArrayReturn(arrayArg: WorkerInput<string[]>) {
  return arrayArg.map(string => `augmented: ${string}`);
}

export function stringArgVoidReturn(stringArg: WorkerInput<string>) {
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

export function functionArgStringReturn(
  inputFunction: WorkerInput<() => string>,
) {
  const result = inputFunction();
  return typeof result === 'string'
    ? `Hello ${result}`
    : result.then(final => `Hello ${final}`);
}

export function objectWithStringArgObjectReturn(
  objectWithString: WorkerInput<{
    foo: string;
  }>,
) {
  return {
    ...objectWithString,
    foo: `augmented: ${objectWithString.foo}`,
  };
}

export function objectWithFunctionArgObjectReturn(
  objectWithFunction: WorkerInput<{
    func: () => string;
  }>,
) {
  return {
    ...objectWithFunction,
    func: () => 'string',
  };
}

export function arrayOfObjectsWithFunctionsArg(
  arrayArg: WorkerInput<{func: () => string}[]>,
) {
  return arrayArg.concat(
    {
      func: () => 'string',
    },
    {
      func: () => Promise.resolve('string'),
    },
  );
}

export function returnsFunctionReturningObjectWithFunction() {
  return function() {
    return {
      foo: () => 'string',
    };
  };
}
