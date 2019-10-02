export function stringArgStringReturn(stringArg: string) {
  return `${stringArg}`;
}

export function arrayArgArrayReturn(arrayArg: string[]) {
  return arrayArg.map(string => `augmented: ${string}`);
}

export function stringArgVoidReturn(stringArg: string) {
  // eslint-disable-next-line no-console
  console.log(stringArg);
}

export function multipleArgsStringReturn(stringArg: string, numberArg: number) {
  return `${stringArg} - ${numberArg}`;
}

export function stringArgFunctionReturn(stringArg: string) {
  return () => `${stringArg}`;
}

export function functionArgStringReturn(inputFunction: () => string) {
  return `${inputFunction()}`;
}

export function functionArgFunctionReturn(input: () => string) {
  return () => `${input()}`;
}

export function objectArgObjectReturn(objectWithFunction: {
  func: () => string;
}) {
  return {
    ...objectWithFunction,
    func: `augmented: ${objectWithFunction.func()}`,
  };
}

export function arrayOfObjectsWithFunctionsArg(
  arrayArg: {func: () => string}[],
) {
  return arrayArg.concat({func: () => 'sup'});
}
