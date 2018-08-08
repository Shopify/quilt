export function deepEqual(first: any, second: any, maxDepth = 2000, depth = 0) {
  const newDepth = depth + 1;

  if (newDepth > maxDepth) {
    throw new Error('Maximum comparison depth reached.');
  }

  if (first === second) {
    return true;
  }

  if (typeof first !== typeof second) {
    return false;
  }

  if (Array.isArray(first)) {
    return arrayEqual(first, second, maxDepth, depth);
  }

  if (typeof first === 'object') {
    return objectEqual(first, second, maxDepth, depth);
  }

  return Object.is(first, second);
}

function arrayEqual(
  first: any[],
  second: any[],
  maxDepth: number,
  depth: number,
) {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((valueOfFirst, index) =>
    deepEqual(valueOfFirst, second[index], maxDepth, depth),
  );
}

function objectEqual(first: any, second: any, maxDepth: number, depth: number) {
  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);

  if (firstKeys.length !== secondKeys.length) {
    return false;
  }

  return firstKeys.every(
    key =>
      second.hasOwnProperty(key) &&
      deepEqual(first[key], second[key], maxDepth, depth),
  );
}

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
