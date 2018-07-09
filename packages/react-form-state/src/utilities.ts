export function mapObject<Input, Output>(
  input: Input,
  mapper: (value: any, key: keyof Input) => any,
) {
  return Object.keys(input)
    .map(key => [key, input[key]])
    .reduce((accumulator: any, [key, value]) => {
      accumulator[key] = mapper(value, key as keyof Input);
      return accumulator;
    }, {}) as Output;
}

export function push<T>(array: T[], ...values: T[]) {
  return array.concat(values);
}

export function remove<T>(array: T[], targetIndex: number) {
  return array.filter((_, index) => index !== targetIndex);
}

export function replace<T>(array: T[], targetIndex: number, newValue: T) {
  return array.map((value, index) => {
    if (index !== targetIndex) {
      return value;
    }

    return newValue;
  });
}
